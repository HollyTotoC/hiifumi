import React from "react";
import { useRouter } from "next/navigation";
import { PlayerType, RoomType } from "../types";
import { useSocket } from "../utils/socketContext";
import Image from "next/image";
import Button from "./Button";

interface FinalScoreProps {
    remotePlayer: PlayerType;
    localPlayer: PlayerType;
    room: RoomType;
}

const FinalScore = ({ remotePlayer, localPlayer, room }: FinalScoreProps) => {
    const router = useRouter();
    const socket = useSocket();
    const lpi = localPlayer.id;
    const roomId = room.id;
    const handleClick = () => {
        router.push("/");
        socket?.emit("leaveRoom", { id: lpi, roomId: roomId });
    };
    return (
        <div className="absolute animate-finalScore">
            <div className="relative">
                <div className="flex flex-col items-center h-fit text-center border-2 border-black bg-white relative p-5 !pb-9 z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                    <p className="text-4xl px-2 py-2 font-bold mx-auto text-center">
                        {remotePlayer?.score !== undefined &&
                        localPlayer?.score !== undefined
                            ? remotePlayer.score > localPlayer.score
                                ? "🫢 You lost 🫣"
                                : "👑 You won 🍾"
                            : "Scores are not available"}
                    </p>
                    <div className="flex items-center justify-center mt-5">
                        <div className="flex flex-col items-center justify-center text-center px-4 border-r border-black">
                            <div className="p-1 border-2 border-black rounded-full h-16 w-16 object-fill">
                                <Image
                                    src={`/avatar/${localPlayer.avatar}.svg`}
                                    alt={`Avatar ${localPlayer.avatar}`}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-xl font-semibold">
                                {localPlayer.name}
                            </p>
                            <p className="text-3xl font-semibold">
                                {localPlayer.score}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center px-4 border-l border-black">
                            <div className="p-1 border-2 border-black rounded-full h-16 w-16 object-fill">
                                <Image
                                    src={`/avatar/${remotePlayer.avatar}.svg`}
                                    alt={`Avatar ${remotePlayer.avatar}`}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-xl font-semibold">
                                {remotePlayer.name}
                            </p>
                            <p className="text-3xl font-semibold">
                                {remotePlayer.score}
                            </p>
                        </div>
                    </div>
                </div>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-violet-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-green-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
            </div>
            <div className="flex justify-center mt-12">
                <Button content="Return to home" onClick={handleClick} />
            </div>
        </div>
    );
};

export default FinalScore;
