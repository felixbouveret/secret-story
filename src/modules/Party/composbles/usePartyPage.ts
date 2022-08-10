import { reactive } from 'vue';

import { listenParty, listenPartyMembers } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';

const partyData = reactive({} as { party: PartyInterface; members: any[] });

const triggerPartyListen = (partyUid: string) =>
  listenParty(partyUid, async (party) => {
    partyData.party = party;
  });
const triggerPartyMembersListen = (partyUid: string) =>
  listenPartyMembers(partyUid, async (members) => {
    partyData.members = members;
  });

export const usePartyPage = () => ({
  partyData,
  triggerPartyListen,
  triggerPartyMembersListen
});
