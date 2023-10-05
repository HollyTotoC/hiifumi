"use client";

import React from "react";
import Loading from "../../components/Loading";
import PlayerSection from "../../components/PlayerSection";
import MoveSection from "../../components/MoveSection";
import { RenderMove } from "../../components/RenderMove";
import { useState, useEffect } from "react";
import { useSocket } from "../../utils/socketContext";
import { usePathname, useSearchParams } from "next/navigation";

type PlayerType = {
    id?: string;
    name?: string;
    avatar?: string;
    move?: string | null;
    score?: number;
    moveSet?: boolean;
};

type RoomType = {
    p1?: PlayerType;
    p2?: PlayerType;
    round?: number;
    displayStep?: number;
    isPrivate?: boolean;
    id?: string;
};

const Game = () => {
    const socket = useSocket();
    const searchPathName = usePathname();
    const searchParams = useSearchParams();
    const roomId = searchPathName.replace("/game/", "");
    const playerUrlId = searchParams.get("lpi");
    const playerRandom = searchParams.get("rdm");
    const isInvited = searchParams.get("invite");

    const [localPlayer, setLocalPlayer] = useState<PlayerType>({});
    const [remotePlayer, setRemotePlayer] = useState<PlayerType>({});
    const [room, setRoom] = useState<RoomType>({});
    const playerId = localPlayer?.id || "";
    const turn = room?.displayStep || 0;

    useEffect(() => {
        console.log("roomId", roomId);
        console.log("isInvited ?", isInvited);
        if (!socket || !roomId) {
            alert("Someting went wrong, please try again later 'error code 1'");
        }

        if (isInvited) {
            //trigger joinFriend to get full room and set p2
            socket?.emit("setUp", roomId);
            socket?.on("isSetUp", (data) => {
                console.log("isSetUp", data);
                setLocalPlayer(data.p1);
                setRemotePlayer(data.p2);
                setRoom(data);
                console.log("isSetUpDone", data);
            });
        } else if (playerRandom) {
            //trigger findRoom to find available room or set one
            socket?.emit("joinRandom", { roomId });
            socket?.on("isSetup", (data) => {
                setLocalPlayer(data.p1);
                setRemotePlayer(data.p2);
                setRoom(data);
            });
        } else if (socket && roomId && !isInvited && !playerRandom) {
            console.log("the good stuff", roomId);
            socket.emit("getInitialState", roomId);
            socket.on("initialState", (data) => {
                setLocalPlayer(data.p1);
                setRoom(data);
            });
        } else {
            alert("Someting went wrong, please try again later 'error code 2'");
        }
    }, [socket, roomId, isInvited, playerRandom]);

    useEffect(() => {
        console.log("useEffect");
        console.table({
            roomId,
            socket,
            localPlayer,
            remotePlayer,
            room,
            isInvited,
            playerRandom,
        });
    }, [
        socket,
        roomId,
        localPlayer,
        remotePlayer,
        room,
        isInvited,
        playerRandom,
    ]);

    const handleMoveSelection = (playerId, move) => {};

    let gameConntent;
    switch (turn) {
        case 0:
            gameConntent = <Loading textContent="Waiting for a player" />;
            break;
        case 1:
            gameConntent = (
                <MoveSection
                    playerId={playerId}
                    handleMoveSelection={handleMoveSelection}
                />
            );
            break;
        case 2:
            gameConntent = <RenderMove players={room} />;
            break;
        case 3:
            gameConntent = <p>Winner / Loser</p>;
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
            <section className="flex items-center justify-center grow">
                {gameConntent}
            </section>
            <PlayerSection
                playerName={localPlayer?.name}
                playerSives={localPlayer?.score}
                playerAvatar={localPlayer?.avatar}
                isReversed={true}
                bgColor={"orange-300"}
                border={"t"}
            />
        </main>
    );
};

export default Game;
