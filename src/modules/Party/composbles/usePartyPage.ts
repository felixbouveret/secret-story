import { reactive } from 'vue';

import { getAnecdotesToAnwser, listenParty, listenPartyMembers } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';
import { useUser } from '@/composables/useUser';

const { userData } = useUser();

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
  partyData.anecdotesToAnwser = await getAnecdotesToAnwser(partyUid, userData.uid);
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
