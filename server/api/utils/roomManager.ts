import { Player, Room, Rooms } from "../../type";

export const createRoom = (isPrivate: boolean): string => {
  const roomId = generateRoomId();
  return roomId;
};

export const findAvailableRoom = (rooms: Rooms): string | null => {
  const availableRoom = Object.values(rooms).find(
    (room) => !room.isPrivate && !room.p2,
  );
  return availableRoom ? availableRoom.id : null;
};

const generateRoomId = (): string => {
  // Generate a unique room ID. This can be enhanced further.
  return Math.random().toString(36).substr(2, 9);
};
