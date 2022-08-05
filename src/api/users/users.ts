import { doc, setDoc } from 'firebase/firestore';

import db from '@/api/firestore';

import { UserInterface } from './types';

export const addUser = async (user: UserInterface) => {
  try {
    await setDoc(doc(db, 'users', user.uid), user);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
export const updateUser = async (user: UserInterface) => {
  try {
    await setDoc(doc(db, 'users', user.uid), user, { merge: true });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
