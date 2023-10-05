import React from "react";
import RenderResult from "../components/RenderResult";

interface RenderMoveProps {
    players: {
        moves: string[];
    };
}

export const RenderMove = ({ players }) => {
    return (
        <div className="flex flex-col items-center justify-center grow h-full w-full">
            <article className="flex grow items-center justify-center border-b-[1px] border-black h-full w-full bg-yellow-300 translate-x-[-100%] animate-slideInFromLeft">
                <p className="text-5xl">{players[0].moves[0]}</p>
            </article>
            <article className="flex grow items-center justify-center border-t-[1px] border-black h-full w-full bg-pink-300 translate-x-[100%] animate-slideInFromRight">
                <p className="text-5xl">{players[1].moves[0]}</p>
            </article>
            <RenderResult textContent="1&#8209;0" />
        </div>
    );
};
