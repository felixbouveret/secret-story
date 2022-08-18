export interface AnecdoteInterface {
  content: string;
  isDeceit: boolean;
}
export interface PartyMemberInterface {
  uid: string;
  isReady: boolean;
  isHost: boolean;
  guessed: boolean;
  anecdotes?: AnecdoteInterface[];
}

export interface PartyInterface {
  id: string;
  name: string;
  isStarted: boolean;
  canStart: boolean;
  membersUid: string[];
  startingDate: Date;
}
