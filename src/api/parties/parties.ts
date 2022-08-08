import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

import db from '@/api/firestore';

import { PartyInterface } from './types';

export const createParty = async (party: PartyInterface) => {
  try {
    const id = nanoid();
    await setDoc(doc(db, 'parties', id), { ...party, id });
    return id;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getParty = async (uid: string) => {
  const docRef = doc(db, 'parties', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};

export const getParties = async (uid: string) => {
  const q = query(collection(db, 'parties'), where('membersUid', 'array-contains', uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
};

export const listenParties = (uid: string, callback: (parties: PartyInterface[]) => void) => {
  const q = query(collection(db, 'parties'), where('membersUid', 'array-contains', uid));

  return onSnapshot(q, (querySnapshot) => {
    const parties: PartyInterface[] = [];
    querySnapshot.forEach((doc) => {
      parties.push(doc.data() as PartyInterface);
    });
    callback(parties);
  });
};

export const updateParty = async (party: PartyInterface) => {
  try {
    await setDoc(doc(db, 'parties', party.id), party, { merge: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const joinParty = async (partyId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'parties', partyId), {
      membersUid: arrayUnion(userId)
    });
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const leaveParty = async (partyId: string, userId: string) => {
  try {
    await updateDoc(doc(db, 'parties', partyId), {
      membersUid: arrayRemove(userId)
    });
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteParty = async (partyId: string) => {
  try {
    await deleteDoc(doc(db, 'parties', partyId));
    await deleteDoc(doc(db, 'parties', partyId, 'membersUid'));
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};
