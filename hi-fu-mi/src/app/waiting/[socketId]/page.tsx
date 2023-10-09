"use client";

import { useEffect } from "react";
import { useSocket } from "../../utils/socketContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React from "react";
import { BsCircleFill } from "react-icons/bs";

const Waiting = () => {
    const router = useRouter();
    const socket = useSocket();
    const socketId = usePathname().replace("/waiting/", "");
    const circleData = [
        { color: "text-blue-300", animation: "animate-scalePulse-0" },
        { color: "text-pink-300", animation: "animate-scalePulse-500" },
        { color: "text-yellow-300", animation: "animate-scalePulse-1000" },
    ];

    useEffect(() => {
        if (socketId) {
            // Émettre un événement au serveur pour indiquer que ce client est prêt
            socket?.emit("clientReady", { socketId });

            // Écouter l'événement 'roomCreated' pour la redirection
            socket?.on("roomCreated", (roomId: string) => {
                router.push(`/game/${roomId}?lpi=${socketId}`);
            });
        }

        // Nettoyage lors du démontage du composant
        return () => {
            socket?.off("roomCreated");
        };
    }, [socketId, router, socket]);

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="relative w-3/5">
                <div className="flex flex-col items-center h-fit gap-2 p-4 text-center border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                    <p className="text-xl font-bold">
                        Waiting for someone to join. Be patient 😉
                    </p>
                    <div className="flex gap-1 p-2">
                        {circleData.map((dot, index) => (
                            <React.Fragment key={`dot${index}`}>
                                <BsCircleFill
                                    className={`text-lg ${dot.color} ${dot.animation}`}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-pink-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-yellow-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
            </div>
        </div>
    );
};

export default Waiting;