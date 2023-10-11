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
import DesktopUI from "../../components/DesktopUI";

const Game = () => {
    const socket = useSocket();
    const searchPathName = usePathname();
    const searchParams = useSearchParams();
    const roomId = searchPathName.replace("/game/", "");
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
        if (!socket || !roomId) {
            alert("Someting went wrong, please try again later 'error code 1'");
        }
        if (socket && lpi && roomId) {
            socket.emit("inGame", { roomId });
            socket.on("isSetUp", (updateRoom: RoomType) => {
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
        if (socket && roomId) {
            socket.on("updateRoom", (updateRoom) => {
                if ("result" in updateRoom) {
                    setRoom(updateRoom.room);
                    setPlayers(updateRoom, lpi);
                    setResult(updateRoom.result);
                } else {
                    setRoom(updateRoom);
                    setPlayers(updateRoom, lpi);
                }
            });
        }
        return () => {
            socket?.off("updateRoom");
        };
    }, [socket, roomId, lpi, room]);

    useEffect(() => {
        console.info("turn", turn);

        const handleAnimationEnd = () => {
            if (socket && roomId && result) {
                socket.emit("animationEnd", { roomId, result });
            }
        };
        if (turn === 2) {
            const timerId = setTimeout(handleAnimationEnd, 5500);

            return () => clearTimeout(timerId);
        }
    }, [turn, socket, roomId, result, room]);

    const handleMoveSelection = (playerId: string, move: string) => {
        if (socket) {
            socket.emit("move", { roomId, playerId, move });
        }
    };

    let gameConntent;
    switch (turn) {
        case 1:
            gameConntent = lpi ? (
                <MoveSection
                    playerId={lpi}
                    handleMoveSelection={handleMoveSelection}
                />
            ) : null;
            break;
        case 2:
            gameConntent = (
                <RenderMove
                    localPlayer={localPlayer}
                    remotePlayer={remotePlayer}
                />
            );
            break;
        case 3:
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
        <DesktopUI>
            <main className="h-full flex flex-col">
                <PlayerSection
                    playerName={remotePlayer?.name}
                    playerScore={remotePlayer?.score}
                    playerAvatar={remotePlayer?.avatar}
                    isReversed={false}
                    bgColor={"violet-300"}
                    border={"border-b-2"}
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
                    border={"border-t-2"}
                />
            </main>
        </DesktopUI>
    );
};

export default Game;
