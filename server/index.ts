import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors"; // <-- Import the cors library
import { isValidMove, determineWinner } from "./utils/gameLogic.ts";
import { createRoom, findAvailableRoom } from "./utils/roomManager.ts";
import { Player, Room, Rooms } from "./type";

const app = express();

// Use the cors middleware
app.use(cors());

const server = http.createServer(app);
console.log("Server starting... yeeaah");
// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const WAITING_FOR_PLAYER = 0;
const BOTH_PLAYERS_CONNECTED = 1;
const SHOW_RESULT = 2;
const FINAL_SCORE = 3;

let rooms: Rooms = {};

// const updateDisplayStep = (roomId: string, step: number) => {
//   rooms[roomId].displayStep = step;
//   io.to(roomId).emit("updateDisplayStep", rooms[roomId].displayStep);
// };

const handlePlayerMove = (
  roomId: string,
  playerKey: "p1" | "p2",
  move: string,
  playerId: string,
) => {
  const room = rooms[roomId];
  if (room.p1.id === playerId) {
    room.p1.move = move;
    room.p1.moveSet = true;
  } else if (room.p2 && room.p2.id === playerId) {
    room.p2.move = move;
    room.p2.moveSet = true;
  }

  console.log(`Player ${playerKey} in Room ${roomId}:`);
  console.table(room[playerKey]);

  if (room.p1.moveSet && room.p2 && room.p2.moveSet) {
    const result = determineWinner(room.p1.move!, room.p2.move!);
    if (result === "A") room.p1.score += 1;
    else if (result === "B") room.p2.score += 1;
    else if (result === "Tie") {
      // Handle the tie scenario
      console.log("It's a tie!");
    }

    console.log("Round Result:");
    console.log(
      `Winner: ${
        result === "Tie" ? "No one, it's a tie!" : `Player ${result}`
      }`,
    );
    console.log(`Player 1 Score: ${room.p1.score}`);
    console.log(`Player 2 Score: ${room.p2.score}`);

    room.displayStep = SHOW_RESULT;
    io.to(roomId).emit("roundResult", {
      winner: result,
      scores: {
        playerA: room.p1.score,
        playerB: room.p2.score,
      },
    });

    room.p1.move = null;
    room.p1.moveSet = false;
    room.p2.move = null;
    room.p2.moveSet = false;
    if (result !== "Tie") room.round += 1; // Only increment the round if it's not a tie
    room.displayStep = BOTH_PLAYERS_CONNECTED;
  } else {
    room.displayStep = BOTH_PLAYERS_CONNECTED;
  }
};

io.on("connection", (socket) => {
  console.log("Rooms:", rooms);
  console.log("A user connected");

  socket.on("createRoom", (data) => {
    const isPrivate = data.private;
    const playerProfile = data.profile;
    const roomId = createRoom(isPrivate);
    rooms[roomId] = {
      p1: {
        ...playerProfile,
        move: null,
        score: 0,
        moveSet: false,
      },
      round: 1,
      displayStep: WAITING_FOR_PLAYER,
      isPrivate: isPrivate,
      id: roomId,
    };
    console.log("Create Rooms:");
    console.log("Room ID:", roomId);
    console.table(rooms[roomId]);
    console.log("p1 infos");
    console.table(rooms[roomId].p1);

    socket.join(roomId);
    socket.emit("roomCreated", roomId);
  });

  socket.on("getInitialState", (roomId) => {
    console.log("Room ID initial:", roomId);
    console.table(rooms[roomId]);
    socket.emit("initialState", rooms[roomId]);
  });

  socket.on("joinRoom", (data) => {
    const roomId = data.roomId;
    const playerProfile = data.profile;

    // Check if the room exists
    if (!rooms[roomId]) {
      console.log("Room not found");
      return socket.emit("roomJoinError", "Room not found.");
    }
    // Check if the room already has a p2 (second player)
    if (rooms[roomId].p2) {
      console.log("Room already has two players");
      return socket.emit("roomJoinError", "Room is full.");
    }
    console.log("Player profile: ", playerProfile);
    rooms[roomId].p2 = {
      ...playerProfile,
      move: null,
      score: 0,
      moveSet: false,
    };

    console.log("Join Rooms:");
    console.log("p2 Info");
    console.table(rooms[roomId].p2);
    console.log("Rooms:", rooms);
    console.table(rooms[roomId]);

    socket.join(roomId);
    socket.emit("roomJoined", roomId);
  });

  socket.on("setUp", (roomId) => {
    console.log("Room ID initial:", roomId);
    console.table(rooms[roomId]);
    rooms[roomId].displayStep = BOTH_PLAYERS_CONNECTED;
    socket.broadcast.to(roomId).emit("isSetUp", rooms[roomId]);
  });

  socket.on("findRoom", (playerProfile) => {
    const roomId = findAvailableRoom(rooms);
    console.log("Find Rooms: " + roomId);
    if (roomId) {
      // Join the available room as p2
      rooms[roomId].p2 = {
        ...playerProfile,
        move: null,
        score: 0,
        moveSet: false,
      };

      console.log("Find: Joining existing room:");
      console.log("Room ID:", roomId);
      console.table(rooms[roomId]);
      console.log("p2 infos");
      console.table(rooms[roomId].p2);

      socket.join(roomId);
      socket.emit("roomFound", roomId);
      socket.emit("initialPlayer", [rooms[roomId].p1, rooms[roomId].p2]);
    } else {
      // Create a new room
      const newRoomId = createRoom(false);
      rooms[newRoomId] = {
        p1: {
          ...playerProfile,
          move: null,
          score: 0,
          moveSet: false,
        },
        round: 1,
        displayStep: WAITING_FOR_PLAYER,
        isPrivate: false,
        id: newRoomId,
      };

      console.log("Find: Creating new room:");
      console.log("Room ID:", newRoomId);
      console.table(rooms[newRoomId]);
      console.log("p1 infos");
      console.table(rooms[newRoomId].p1);

      socket.join(newRoomId);
      socket.emit("roomCreated", newRoomId);
      socket.emit("initialPlayer", [rooms[newRoomId].p1]);
    }
  });

  socket.on("joinRandom", (data) => {
    const roomId = data.roomId;
    rooms[roomId].displayStep = BOTH_PLAYERS_CONNECTED;
    socket.broadcast.to(roomId).emit("isSetUp", rooms[roomId]);
  });

  socket.on("playerMove", (roomId, playerId, move) => {
    if (!isValidMove(move)) return socket.emit("invalidMove");

    const room = rooms[roomId];
    let playerKey = null;

    if (room.p1.id === playerId) {
      playerKey = "p1";
    } else if (room.p2 && room.p2.id === playerId) {
      playerKey = "p2";
    }

    if (playerKey) {
      handlePlayerMove(roomId, playerKey as "p1" | "p2", move, playerId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    for (const roomId in rooms) {
      const room = rooms[roomId];

      // Si l'un des joueurs est le joueur déconnecté, mettez à jour displayStep
      if (
        (room.p1 && room.p1.id === socket.id) ||
        (room.p2 && room.p2.id === socket.id)
      ) {
        room.displayStep = FINAL_SCORE;
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
