import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

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

const spliteArray = (array: string[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
export const getMultipleUsers = async (uids: string[]): Promise<UserInterface[]> => {
  if (uids.length > 10) {
    const splitedArray = spliteArray(uids, 10);

    const result: UserInterface[] = [];
    for (const array of splitedArray) {
      const q = query(collection(db, 'users'), where('uid', 'in', array));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        result.push(doc.data() as UserInterface);
      });
    }
    return result;
  } else {
    const result: UserInterface[] = [];

    const q = query(collection(db, 'users'), where('uid', 'in', uids));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push(doc.data() as UserInterface);
    });

    return result;
  }
};
