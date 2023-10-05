// types.ts

export type Player = {
  id: string;
  name: string;
  avatar: string;
  move: string | null;
  score: number;
  moveSet: boolean;
};

export type Room = {
  p1: Player;
  p2?: Player;
  round: number;
  displayStep: number;
  isPrivate: boolean;
  id: string;
};

export type Rooms = { [roomId: string]: Room };
