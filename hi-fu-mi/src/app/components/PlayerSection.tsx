"use client";
import { BsHeartFill, BsHeartbreak } from "react-icons/bs";

interface PlayerSectionProps {
    playerName: string;
    playerAvatar: string;
    playerScore: number;
    isReversed: boolean;
    bgColor: string;
    border: string;
}

const PlayerSection = ({
    playerName,
    playerAvatar,
    playerScore,
    isReversed,
    bgColor,
    border,
}: PlayerSectionProps) => {
    return (
        <section
            className={`border-${border}-2 border-black bg-${bgColor} flex ${
                isReversed ? "flex-row-reverse" : "flex-row"
            } justify-end items-center gap-2 p-2`}
        >
            <p
                className={`rounded-full border-2 border-black bg-white px-3 ${
                    isReversed ? "ml-auto" : "mr-auto"
                }`}
            >
                {playerName}
            </p>

            {Array.from({ length: playerScore }).map((_, index) => (
                <BsHeartFill
                    key={`life${index}`}
                    className="text-2xl text-red-600"
                />
            ))}
            <p className="rounded-full border-2 border-black bg-white p-1 text-2xl">
                {playerAvatar}
            </p>
        </section>
    );
};

export default PlayerSection;
