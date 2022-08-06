export interface PartyInterface {
  id: string;
  name: string;
  ownerUid: string;
  membersUid: string[];
  startingDate: Date;
  endingDate: Date;
}
