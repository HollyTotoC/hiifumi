"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../utils/socketContext";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { BsCircleFill } from "react-icons/bs";
import DesktopUI from "../../components/DesktopUI";

const Waiting = () => {
    const router = useRouter();
    const socket = useSocket();
    const invite = useSearchParams().get("invite");
    const socketId = usePathname().replace("/waiting/", "");
    const circleData = [
        { color: "text-blue-300", animation: "animate-scalePulse-0" },
        { color: "text-pink-300", animation: "animate-scalePulse-500" },
        { color: "text-yellow-300", animation: "animate-scalePulse-1000" },
    ];
    const [inviteId, setInviteId] = useState(null);

    useEffect(() => {
        if (socketId) {
            // Émettre un événement au serveur pour indiquer que ce client est prêt
            socket?.emit("clientReady", { socketId });
            socket?.on("roomId", (roomId) => {
                setInviteId(roomId);
            });

            // Écouter l'événement 'roomCreated' pour la redirection
            socket?.on("roomCreated", (roomId: string) => {
                router.push(`/game/${roomId}?lpi=${socketId}`);
            });
        }

        // Nettoyage lors du démontage du composant
        return () => {
            socket?.off("roomCreated");
        };
    }, [socketId, router, socket, invite]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Text copied to clipboard");
            })
            .catch((err) => {
                console.error("Error in copying text: ", err);
            });
    };

    return (
        <DesktopUI>
            <main className="h-full w-full flex justify-center items-center">
                <div className="relative w-3/5">
                    <div className="flex flex-col items-center h-fit gap-6 px-4 py-10 text-center border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                        <p className="text-xl font-bold">
                            Quelqu&apos;un ne devrait pas tarder. N&apos;hésite
                            pas à partager le site si tu ne trouves personne 😉
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
                        <p
                            className={`p-2 border-2 border-black cursor-pointer ${
                                invite === null ? "hidden" : ""
                            }`}
                            onClick={() => {
                                if (invite !== null) {
                                    const text = `${window.location.origin}/?rid=${invite}`;
                                    copyToClipboard(text);
                                }
                            }}
                        >
                            {window.location.origin}/?rid=${invite}
                        </p>
                        <p
                            className={` mt-3 ${
                                invite === null ? "hidden" : ""
                            }`}
                        >
                            Partage ce lien avec la personne que tu veux défier.
                        </p>
                    </div>
                    <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-pink-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
                    <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-yellow-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
                </div>
            </main>
        </DesktopUI>
    );
};

export default Waiting;
