import * as Cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { AnecdoteInterface, PartyMemberInterface } from './types';

admin.initializeApp();
const cors = Cors({ origin: true });

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
  const partyId = req.query.partyId as string;

  if (!partyId) {
    cors(req, res, () => res.json({ status: 404, message: 'Missing partyId' }));
    return;
  }
  const db = admin.firestore();
  const membersDocuments = await db.collection(`parties/${partyId}/members`).listDocuments();

  if (membersDocuments.length === 0) {
    cors(req, res, () => res.json({ status: 404, message: 'No members found' }));
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
  cors(req, res, () => res.send({ status: 'ok', data: 'Party started' }));
});

interface guessInterface {
  partyId: string;
  guesserUid: string;
  anecdotesOwnerUid: string;
  anecdote: string;
}

export const makeAGuess = functions.https.onRequest(async (req, res) => {
  const payload = req.body.data as guessInterface | undefined;

  if (!payload || !Object.keys(payload).length) {
    cors(req, res, () =>
      res.status(400).send({ data: { code: 400, message: 'Missing payload', isCorrect: false } })
    );
    return;
  }

  const db = admin.firestore();
  const userSnapshot = await db
    .collection(`parties/${payload.partyId}/members`)
    .doc(payload.guesserUid)
    .get();

  const user = userSnapshot.data();

  if (user?.lastGuessDate) {
    const formattedDate = new Date(user.lastGuessDate.seconds * 1000);
    if (formattedDate.getTime() > Date.now() - 3600000) {
      cors(req, res, () =>
        res.status(200).send({
          data: {
            code: 200,
            message: 'You can only make a guess once an hour',
            isCorrect: false,
            isTooEarly: true
          }
        })
      );
      return;
    }
  }

  const anecdotesToGuessSnapshot = await db
    .collection(`parties/${payload.partyId}/anecdotesToGuess`)
    .doc(payload.guesserUid)
    .get();

  const anecdotesToGuess = anecdotesToGuessSnapshot.data() as {
    anecdotesOwnerUid: string;
    anecdotes: AnecdoteInterface[];
  };
  const anecdotesOwnerUid = anecdotesToGuess.anecdotesOwnerUid;
  const deceitAnecdote = anecdotesToGuess.anecdotes.find(({ isDeceit }) => isDeceit);

  if (
    anecdotesOwnerUid !== payload.anecdotesOwnerUid ||
    deceitAnecdote?.content !== payload.anecdote
  ) {
    cors(req, res, () =>
      res
        .status(200)
        .send({ data: { code: 200, message: 'One of your answer is incorrect', isCorrect: false } })
    );
    return;
  }
  cors(req, res, () =>
    res.status(200).send({ data: { code: 200, message: 'Success', isCorrect: true } })
  );
});
