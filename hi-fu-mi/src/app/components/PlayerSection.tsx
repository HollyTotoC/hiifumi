"use client";
import { BsStar } from "react-icons/bs";
import Image from "next/image";

interface PlayerSectionProps {
    playerName: string | undefined;
    playerAvatar: number | undefined;
    playerScore: number | undefined;
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
            className={`${border} border-black bg-${bgColor} flex ${
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

            {Array.from({ length: playerScore || 0 }).map((_, index) => (
                <BsStar key={`life${index}`} className="text-2xl text-black" />
            ))}
            <div className="rounded-full border-2 border-black bg-white p-1 text-2xl">
                <Image
                    src={`/avatar/${playerAvatar}.svg`}
                    alt={`Avatar ${playerAvatar}`}
                    width={30}
                    height={30}
                />
            </div>
        </section>
    );
};

export default PlayerSection;
