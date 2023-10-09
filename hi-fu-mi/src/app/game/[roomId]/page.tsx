"use client";

import React from "react";
import Loading from "../../components/Loading";
import PlayerSection from "../../components/PlayerSection";
import MoveSection from "../../components/MoveSection";
import FinalScore from "../../components/FinalScore";
import { RenderMove } from "../../components/RenderMove";
import { useState, useEffect } from "react";
import { useSocket } from "../../utils/socketContext";
import { usePathname, useSearchParams } from "next/navigation";
import { PlayerType, RoomType } from "../../types";

const Game = () => {
    const socket = useSocket();
    const searchPathName = usePathname();
    const searchParams = useSearchParams();
    const roomId = searchPathName.replace("/game/", "");
    //lpi = localPlayerId
    const lpi = searchParams.get("lpi");

    const [localPlayer, setLocalPlayer] = useState<PlayerType>({});
    const [remotePlayer, setRemotePlayer] = useState<PlayerType>({});
    const [room, setRoom] = useState<RoomType>({});
    const turn = room?.displayStep || 0;
    const [result, setResult] = useState<string>("");

    const setPlayers = (updateRoom: RoomType, lpi: string | null) => {
        if (updateRoom.p1 && updateRoom.p2) {
            if (updateRoom.p1.id === lpi) {
                setLocalPlayer(updateRoom.p1);
                setRemotePlayer(updateRoom.p2);
            } else if (updateRoom.p2.id === lpi) {
                setLocalPlayer(updateRoom.p2);
                setRemotePlayer(updateRoom.p1);
            }
        }
    };

    useEffect(() => {
        console.log("socket", socket, "lpi", lpi, "roomId", roomId);
        if (!socket || !roomId) {
            alert("Someting went wrong, please try again later 'error code 1'");
        }
        if (socket && lpi && roomId) {
            socket.emit("inGame", { roomId });
            socket.on("isSetUp", (updateRoom: RoomType) => {
                console.log("isSetUp", updateRoom);
                setRoom(updateRoom);
                setPlayers(updateRoom, lpi);
            });
        } else {
            alert("Someting went wrong, please try again later 'error code 2'");
        }

        return () => {
            socket?.off("updateRoom");
        };
    }, [socket, roomId, lpi]);

    useEffect(() => {
        console.log("1");
        if (socket && roomId) {
            console.log("2");
            socket.on("updateRoom", (updateRoom) => {
                console.log("3");
                if ("result" in updateRoom) {
                    console.log("4");
                    console.log("Result:", updateRoom.result);
                    setRoom(updateRoom.room);
                    setPlayers(updateRoom, lpi);
                    setResult(updateRoom.result);
                    console.log("5");
                } else {
                    console.log("6");
                    console.log("updateRoom", updateRoom);
                    console.log(room);
                    setRoom(updateRoom);
                    setPlayers(updateRoom, lpi);
                    console.log(room);
                }
            });
        }
        return () => {
            console.log("off");
            socket?.off("updateRoom");
        };
    }, [socket, roomId, lpi, room]);

    useEffect(() => {
        console.log("useEffect animation", room);
        console.log("turn", turn);
        console.log("result", result);

        const handleAnimationEnd = () => {
            if (socket && roomId && result) {
                socket.emit("animationEnd", { roomId, result });
            }
        };
        if (turn === 2) {
            // Supposons que l'animation démarre immédiatement après que turn passe à 3
            const timerId = setTimeout(handleAnimationEnd, 5500); // Ajustez le temps en conséquence

            return () => clearTimeout(timerId); // Nettoyez le timer pour éviter les fuites de mémoire
        }
    }, [turn, socket, roomId, result, room]);

    useEffect(() => {
        console.log("useEffect");
        console.table({
            localPlayer,
            remotePlayer,
            room,
            turn,
        });
    }, [localPlayer, remotePlayer, room, turn]);

    const handleMoveSelection = (playerId: string, move: string) => {
        console.log("handleMoveSelection", playerId, move);
        if (socket) {
            socket.emit("move", { roomId, playerId, move });
        }
    };

    let gameConntent;
    switch (turn) {
        case 1:
            console.log("turn 1", turn);
            gameConntent = lpi ? (
                <MoveSection
                    playerId={lpi}
                    handleMoveSelection={handleMoveSelection}
                />
            ) : null;
            break;
        case 2:
            console.log("turn 2", turn);
            gameConntent = (
                <RenderMove
                    localPlayer={localPlayer}
                    remotePlayer={remotePlayer}
                />
            );
            break;
        case 3:
            console.log("turn 3", turn);
            gameConntent = (
                <FinalScore
                    localPlayer={localPlayer}
                    remotePlayer={remotePlayer}
                    room={room}
                />
            );
            break;
        default:
            gameConntent = <p>error</p>;
    }

    return (
        <main className="h-screen flex flex-col">
            <PlayerSection
                playerName={remotePlayer?.name}
                playerScore={remotePlayer?.score}
                playerAvatar={remotePlayer?.avatar}
                isReversed={false}
                bgColor={"violet-300"}
                border={"b"}
            />
            <section className="flex items-center justify-center grow overflow-hidden">
                {gameConntent}
            </section>
            <PlayerSection
                playerName={localPlayer?.name}
                playerScore={localPlayer?.score}
                playerAvatar={localPlayer?.avatar}
                isReversed={true}
                bgColor={"orange-300"}
                border={"t"}
            />
        </main>
    );
};

export default Game;
