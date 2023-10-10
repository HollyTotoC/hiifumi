import { instrument } from "@socket.io/admin-ui";

import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors"; // <-- Import the cors library
import { isValidMove, determineWinner } from "./utils/gameLogic.js";
import { createRoom, findAvailableRoom } from "./utils/roomManager.js";

const app = express();
dotenv.config();

// Use the cors middleware
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).send("Server is running!");
});

const server = http.createServer(app);
console.log("Server starting... yeeaah");
// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io", "https://hiifumi-hi-fu-mi.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});


const BOTH_PLAYERS_CONNECTED = 1;
const SHOW_RESULT = 2;
const FINAL_SCORE = 3;

class Player {
  constructor(
    public id: string,
    public name: string,
    public avatar: string,
    public score: number = 0,
    public move: string | null = null,
    public moveSet: boolean = false,
    public isReady: boolean = false,
  ) {}
}

class Room {
  public p1: Player | null = null;
  public p2: Player | null = null;
  public round: number = 1;
  public displayStep: number = 1;

  constructor(public id: string) {}

  addPlayer(player: Player) {
    if (!this.p1) {
      this.p1 = player;
    } else if (!this.p2) {
      this.p2 = player;
    }
  }

  isReady(): boolean {
    return this.p1 !== null && this.p2 !== null;
  }
}

const rooms: Map<string, Room> = new Map();
const randomQueue: Player[] = [];
const friendQueue: Map<string, Player[]> = new Map();

const handlePlayerMove = (
  roomId: string,
  playerKey: "p1" | "p2",
  move: string,
  playerId: string,
) => {
  const room = rooms.get(roomId);
  if (room) {
    if (room.p1 && room.p1.id === playerId) {
      room.p1.move = move;
      room.p1.moveSet = true;
    } else if (room.p2 && room.p2.id === playerId) {
      room.p2.move = move;
      room.p2.moveSet = true;
    }
    console.log(`Player ${playerKey} in Room ${roomId}:`);

    if (room.p1 && room.p1.moveSet && room.p2 && room.p2.moveSet) {
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
      io.to(roomId).emit("updateRoom", { room, result: result });
    }
  }
  io.to(roomId).emit("updateRoom", room);
};

interface ClientReadyData {
  socketId: string;
}

interface CreateRoomData {
  roomId: string;
  player: Player;
  type: string;
}

interface CallbackData {
  (data: string): void;
}
interface RoomReady {
  roomId: string;
}

interface MoveData {
  roomId: string;
  playerId: string;
  move: string;
}

interface AnimationEndData {
  roomId: string;
  result: string;
}

interface LeaveRoomData {
  id: string;
  roomId: string;
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createRoom", (data: CreateRoomData, callback: CallbackData) => {
    console.log("Creating room...");
    console.table(data);
    const roomId = data.roomId;
    const playerInfo = data.player;
    const type = data.type;

    const player = new Player(socket.id, playerInfo.name, playerInfo.avatar);
    if (type === "friend") {
      if (!friendQueue.has(roomId)) {
        friendQueue.set(roomId, []);
      }
      friendQueue.get(roomId)?.push(player);
      console.log("Friend queue updated: ", friendQueue);
      if (friendQueue.get(roomId)?.length === 2) {
        const room = new Room(roomId);
        const [player1, player2] = friendQueue.get(roomId) as Player[];
        room.addPlayer(player1);
        room.addPlayer(player2);
        rooms.set(roomId, room);
        io.sockets.sockets.get(player1.id)?.join(roomId);
        io.sockets.sockets.get(player2.id)?.join(roomId);
        friendQueue.delete(roomId);
        if (room.p1) {
          room.p1.isReady = true;
        }
        console.log("Room created: ", room);
      }
      callback("success");
    } else if (type === "random") {
      randomQueue.push(player);
      console.log("Random queue updated: ", randomQueue);
      if (randomQueue.length >= 2) {
        const player1 = randomQueue.shift() as Player;
        const player2 = randomQueue.shift() as Player;
        const roomId = createRoom(false);
        const room = new Room(roomId);
        room.addPlayer(player1);
        room.addPlayer(player2);
        rooms.set(roomId, room);
        io.sockets.sockets.get(player1.id)?.join(roomId);
        io.sockets.sockets.get(player2.id)?.join(roomId);
        console.log("Room created: ", room);
      }
      callback("success");
    }
  });

  socket.on("clientReady", ({ socketId }: ClientReadyData) => {
    // Trouver la salle à laquelle ce client appartient
    console.log("Received clientReady event from:", socketId);

    // Recherche dans les salles créées
    let roomId;
    for (let [id, room] of rooms.entries()) {
      console.log(room, id);
      if (
        (room.p1 && room.p1.id === socketId) ||
        (room.p2 && room.p2.id === socketId)
      ) {
        roomId = id;
        break;
      }
    }

    // Si le joueur n'est pas trouvé dans les salles créées, vérifiez la file d'attente
    if (!roomId) {
      console.log("Checking friendQueue...");
      for (let [id, players] of friendQueue.entries()) {
        console.log(players, id);
        if (players.some((player) => player.id === socketId)) {
          console.log("Player found in friendQueue:", id);
          roomId = id;
          break;
        }
      }
    }

    // Si le joueur n'est toujours pas trouvé, vérifiez la randomQueue
    if (!roomId) {
      console.log("Checking randomQueue...");
      for (let player of randomQueue) {
        console.log(player);
        if (player.id === socketId) {
          console.log("Player found in randomQueue");
          player.isReady = true;
          break;
        }
      }
    }

    if (!roomId) {
      console.error("Client does not belong to any room or queue:", socketId);
      return;
    }

    const room = rooms.get(roomId);
    // Marquer ce client comme prêt
    if (!room) {
      console.error("Room not found:", roomId);
      return;
    }

    if (room.p1 && room.p1.id === socketId) {
      room.p1.isReady = true;
      io.to(socketId).emit("roomId", roomId);
    } else if (room.p2 && room.p2.id === socketId) {
      room.p2.isReady = true;
    }

    // Vérifier si tous les clients de cette salle sont prêts
    if (room.p1 && room.p2 && room.p1.isReady && room.p2.isReady) {
      io.to(roomId).emit("roomCreated", roomId);
    }
  });

  socket.on("inGame", ({ roomId }: RoomReady) => {
    console.table(rooms);
    const room = rooms.get(roomId);
    console.table(room);
    console.log(BOTH_PLAYERS_CONNECTED);
    if (room) {
      console.log("Room ready for emit");
      console.table(room);
      room.displayStep = BOTH_PLAYERS_CONNECTED;
      socket.emit("isSetUp", room);
      console.log("Room emited");
    }
  });

  socket.on("move", ({ roomId, playerId, move }: MoveData) => {
    if (!isValidMove(move)) return socket.emit("invalidMove");

    const room = rooms.get(roomId);
    let playerKey = null;

    if (room) {
      if (room.p1 && room.p1.id === playerId) {
        playerKey = "p1";
      } else if (room.p2 && room.p2.id === playerId) {
        playerKey = "p2";
      }
    }

    if (playerKey) {
      handlePlayerMove(roomId, playerKey as "p1" | "p2", move, playerId);
    }
  });

  socket.on("animationEnd", ({ roomId, result }: AnimationEndData) => {
    const room = rooms.get(roomId);
    if (room && room.p1 && room.p2) {
      if (result !== "Tie") room.round += 1;

      // Vérifiez si turn est égal à 3
      if (room.round >= 6) {
        room.displayStep = FINAL_SCORE;
      } else {
        room.p1.move = null;
        room.p1.moveSet = false;
        room.p2.move = null;
        room.p2.moveSet = false;
        room.displayStep = BOTH_PLAYERS_CONNECTED; // Sinon, continuez comme avant
      }

      io.to(roomId).emit("updateRoom", room);
    }
  });

  socket.on("leaveRoom", ({ id, roomId }: LeaveRoomData) => {
    console.log("leaveRoom", id);
    socket.leave(roomId); // Quitter la room, pas le joueur

    // Trouver la room dans votre structure de données 'rooms'
    const room = rooms.get(roomId);
    if (room) {
      if (room.p1 && room.p1.id === id) {
        room.p1 = null;
      } else if (room.p2 && room.p2.id === id) {
        room.p2 = null;
      }
      if (!room.p1 && !room.p2) {
        rooms.delete(roomId);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    for (const roomId in rooms) {
      const room = rooms.get(roomId);

      // Si l'un des joueurs est le joueur déconnecté, mettez à jour displayStep
      if (
        (room?.p1 && room.p1.id === socket.id) ||
        (room?.p2 && room.p2.id === socket.id)
      ) {
      }
    }
  });
});

instrument(io, {
  auth: false,
  mode: "development",
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

export default server;
