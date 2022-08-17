export interface AnecdoteInterface {
  content: string;
  isDeceit: boolean;
}
export interface PartyMemberInterface {
  uid: string;
  isReady: boolean;
  isHost: boolean;
  anecdotes?: AnecdoteInterface[];
}

export interface PartyInterface {
  id: string;
  name: string;
  membersUid: string[];
  startingDate: Date;
}
