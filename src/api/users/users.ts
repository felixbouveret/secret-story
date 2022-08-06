import { doc, getDoc, setDoc } from 'firebase/firestore';

import db from '@/api/firestore';

import { UserInterface } from './types';

const documentRef = (uid: string) => doc(db, 'users', uid);

export const addUser = async (user: UserInterface) => {
  try {
    await setDoc(documentRef(user.uid), user);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateUser = async (user: UserInterface) => {
  try {
    await setDoc(documentRef(user.uid), user, { merge: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getUser = async (uid: string) => {
  const docRef = documentRef(uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};
