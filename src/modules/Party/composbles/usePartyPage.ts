import { reactive } from 'vue';

import { getAnecdotesToAnwser, listenParty, listenPartyMembers } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';
import { useArray } from '@/composables/useArray';
import { useUser } from '@/composables/useUser';

const { userData } = useUser();
const { shuffle } = useArray();

const partyData = reactive(
  {} as { party: PartyInterface; members: any[]; anecdotesToAnwser: string[] }
);

const triggerPartyListen = (partyUid: string) =>
  listenParty(partyUid, async (party) => {
    partyData.party = party;
    if (party.isStarted) await getAnecdotesUserToAnwser(partyUid);
  });

const triggerPartyMembersListen = (partyUid: string) =>
  listenPartyMembers(partyUid, async (members) => {
    partyData.members = members;
  });

const getAnecdotesUserToAnwser = async (partyUid: string) => {
  const anecdotes = await getAnecdotesToAnwser(partyUid, userData.uid);
  partyData.anecdotesToAnwser = shuffle(anecdotes);
};

const resetPartyData = () => {
  partyData.party = {};
  partyData.members = [];
  partyData.anecdotesToAnwser = [];
};

export const usePartyPage = () => ({
  partyData,
  triggerPartyListen,
  triggerPartyMembersListen,
  getAnecdotesUserToAnwser,
  resetPartyData
});
