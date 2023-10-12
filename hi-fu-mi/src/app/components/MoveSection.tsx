"use client";

import React from "react";
import Loading from "./Loading";

interface MoveSectionProps {
    playerId: string | null;
    handleMoveSelection: (playerId: string, move: string) => void;
}

const MoveSection = ({ playerId, handleMoveSelection }: MoveSectionProps) => {
    const moveChoices = ["🪨", "📃", "✂️"];

    const onMoveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (playerId) {
            handleMoveSelection(playerId, e.target.value);
        }
    };

    return (
        <div className="relative z-50 flex flex-col items-center justify-center gap-10">
            <Loading textContent="Ton adversaire réfléchit" />
            <div className="relative w-2/3">
                <div className="flex flex-col items-center h-fit gap-1 p-4 px-2 text-center border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                    <p className="text-xl font-bold mb-6">A toi de jouer !</p>
                    <form className="move-choice-list flex flex-wrap items-center justify-center gap-14 p-4">
                        {moveChoices.map((move, index) => (
                            <div key={`dot${index}`} className="group">
                                <input
                                    type="radio"
                                    name="mooveChoice"
                                    id={`choice-${index}`}
                                    value={move}
                                    className="hidden"
                                    onChange={onMoveChange}
                                />
                                <label
                                    htmlFor={`choice-${index}`}
                                    className="text-4xl p-2 rounded-full border-2 border-white hover:cursor-pointer transition-all"
                                >
                                    {move}
                                </label>
                            </div>
                        ))}
                    </form>
                </div>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-pink-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-yellow-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
            </div>
        </div>
    );
};

export default MoveSection;
