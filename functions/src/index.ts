import * as cors from 'cors';
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
      guesserUid: member.uid,
      anecdotesOwnerUid: randomItem.uid,
      anecdotes: randomItem.anecdotes
    };
  });
  if (!shuffled.every((e) => e !== undefined)) return shuffleMembersAnecdotes(members);
  else return shuffled;
};

export const shuffleAnecdotes = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const partyId = req.query.partyId as string;

  if (!partyId) {
    cors()(req, res, () => res.json({ status: 404, message: 'Missing partyId' }));
    return;
  }
  const membersDocuments = await db.collection(`parties/${partyId}/members`).listDocuments();

  if (membersDocuments.length === 0) {
    cors()(req, res, () => res.json({ status: 404, message: 'No members found' }));
    return;
  }

  const partyMembers = (await Promise.all(
    membersDocuments.map(async (doc) => {
      const member = await doc.get();
      return member.data();
    })
  )) as PartyMemberInterface[];

  const shuffledAnecdotes = shuffleMembersAnecdotes(partyMembers);

  await Promise.all(
    shuffledAnecdotes.map(async (member) => {
      await db.collection(`parties/${partyId}/anecdotesToGuess`).doc(member.guesserUid).set(member);
    })
  );
  cors()(req, res, () => res.send({ status: 'ok', data: 'Party started' }));
});
