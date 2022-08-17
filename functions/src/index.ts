import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { PartyMemberInterface } from './types';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const randomInt = (k: number) => Math.floor((k + 1) * Math.random());
const fisherYatesShuffle = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const shuffleMembersAnecdotes = (members: PartyMemberInterface[]): any[] => {
  const referenceArray = [...members];
  const shuffled = members.map((member) => {
    const randomItem = fisherYatesShuffle([...referenceArray]).find(
      ({ uid }) => uid !== member.uid
    );
    referenceArray.splice(referenceArray.indexOf(randomItem), 1);
    return {
      [member.uid]: {
        anecdotesOwnerUid: randomItem.uid,
        anecdotes: randomItem.anecdotes
      }
    };
  });
  if (!shuffled.every((e) => e !== undefined)) return shuffleMembersAnecdotes(members);
  else return shuffled;
};

export const shuffleAnecdotes = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const partyId = req.query.partyId as string;

  if (!partyId) {
    res.status(404).send('Missing partyId');
    return;
  }
  const membersDocuments = await db.collection(`parties/${partyId}/members`).listDocuments();

  if (membersDocuments.length === 0) {
    res.status(404).send('No members found');
    return;
  }

  const partyMembers = (await Promise.all(
    membersDocuments.map(async (doc) => {
      const member = await doc.get();
      return member.data();
    })
  )) as PartyMemberInterface[];

  const shuffledMembers = shuffleMembersAnecdotes(partyMembers);

  await Promise.all(
    shuffledMembers.map(async (member) => {
      await db
        .collection(`parties/${partyId}/anecdotesToGuess`)
        .doc(Object.keys(member)[0])
        .set(member);
    })
  );
  res.status(200).send('OK');
});
