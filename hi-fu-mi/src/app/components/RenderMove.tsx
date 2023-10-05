import React from "react";
import RenderResult from "../components/RenderResult";
import { PlayerType, RoomType } from "../types";

interface RenderMoveProps {
    localPlayer: PlayerType;
    remotePlayer: PlayerType;
}

export const RenderMove = ({ localPlayer, remotePlayer }: RenderMoveProps) => {
    return (
        <div className="flex flex-col items-center justify-center grow h-full w-full">
            <article className="flex grow items-center justify-center border-b-[1px] border-black h-full w-full bg-yellow-300 translate-x-[-100%] animate-slideInFromLeft">
                <p className="text-5xl">{remotePlayer.move}</p>
            </article>
            <article className="flex grow items-center justify-center border-t-[1px] border-black h-full w-full bg-pink-300 translate-x-[100%] animate-slideInFromRight">
                <p className="text-5xl">{localPlayer.move}</p>
            </article>
            <RenderResult
                textContent={`${localPlayer.score}/${remotePlayer.score}`}
            />
        </div>
    );
};
