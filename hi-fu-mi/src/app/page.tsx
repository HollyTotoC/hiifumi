"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./utils/socketContext";
import { useSearchParams } from "next/navigation";
import Button from "./components/Button";
import Image from "next/image";
import DesktopUI from "./components/DesktopUI";
import About from "./components/About";

export default function Home() {
    const router = useRouter();
    const socket = useSocket();
    const urlRoomId = useSearchParams().get("rid");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isSet, setIsSet] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerAvatar, setPlayerAvatar] = useState<number | null>(null);
    const [isDelayed, setIsDelayed] = useState(false);

    useEffect(() => {
        if (isActive) {
            const timerId = setTimeout(() => {
                setIsDelayed(true);
            }, 500);

            return () => clearTimeout(timerId);
        } else {
            setIsDelayed(false);
        }
    }, [isActive]);

    // console.log(playerName, playerAvatar, isActive, isSet);

    useEffect(() => {
        // Récupération des données du localStorage
        const storedPlayerData = localStorage.getItem("playerData");
        // console.log(storedPlayerData);
        if (storedPlayerData) {
            const { playerName, playerAvatar, isActive, isSet } =
                JSON.parse(storedPlayerData);
            setPlayerName(playerName);
            setPlayerAvatar(playerAvatar);
            setIsActive(isActive);
            setIsSet(isSet);
        }
        if (storedPlayerData && urlRoomId) {
            setIsSet(false);
        }
    }, []);

    function debounce<F extends (...args: any[]) => any>(
        func: F,
        delay: number
    ): (...args: Parameters<F>) => void {
        let inDebounce: ReturnType<typeof setTimeout> | undefined;
        return function (this: EventTarget, ...args: Parameters<F>) {
            const context = this;
            if (inDebounce) {
                clearTimeout(inDebounce);
            }
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const handleCreateRoom = (data: any) => {
        socket?.emit("createRoom", data, (ack: string) => {
            if (ack === "success" && data.type === "friend") {
                router.push(`/waiting/${socket?.id}?invite=${data.roomId}`);
            } else if (ack === "success") {
                router.push(`/waiting/${socket?.id}`);
            } else {
                alert("Room not found");
            }
        });
    };

    const playWithFriend = () => {
        const generateRoomId = Math.random().toString(36).substr(2, 9);
        const data = {
            type: "friend",
            roomId: generateRoomId,
            player: { name: playerName, avatar: playerAvatar },
        };
        handleCreateRoom(data);
    };

    const joinFriend = () => {
        const data = {
            type: "friend",
            roomId: urlRoomId,
            player: { name: playerName, avatar: playerAvatar },
        };
        handleCreateRoom(data);
    };

    const playWithRandomPlayer = () => {
        const data = {
            type: "random",
            roomId: urlRoomId,
            player: { name: playerName, avatar: playerAvatar },
        };
        handleCreateRoom(data);
    };

    const handleButtonClick = () => {
        setIsActive(!isActive);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(e.target.value);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setPlayerAvatar(value);
    };

    const handleSubmitPlayer = () => {
        if (playerName && playerAvatar && !urlRoomId) {
            setIsSet(true);
            localStorage.setItem(
                "playerData",
                JSON.stringify({
                    playerName,
                    playerAvatar,
                    isActive: false,
                    isSet: true,
                })
            );
        } else if (playerName && playerAvatar && urlRoomId) {
            localStorage.setItem(
                "playerData",
                JSON.stringify({
                    playerName,
                    playerAvatar,
                    isActive: false,
                    isSet: true,
                })
            );
            joinFriend();
        } else {
            alert("Please select a name and an avatar!");
        }
    };

    function handleImageClick() {
        setIsSet(false);
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <DesktopUI>
            <header
                className={`z-20 absolute top-0 left-0 right-0 w-full grow bg-white flex items-center justify-center flex-col border-b-2 border-opacity-1 ${
                    isActive
                        ? "h-full min-h-full p-10 border-white"
                        : "animate-customBorder"
                }`}
            >
                {!isActive ? (
                    <div
                        className={`flex flex-row justify-between w-full opacity-0 p-2 ${
                            !isDelayed ? "animate-customFadeIn" : ""
                        }`}
                    >
                        <a href="" className="self-center">
                            <h1 className={`font-bold text-2xl`}>
                                <span className="text-pink-300">Hi</span>
                                <span className="text-yellow-300">Fu</span>
                                <span className="text-teal-600">Mi</span>
                            </h1>
                        </a>

                        {isSet ? (
                            <div
                                className="rounded-full border-2 border-black bg-white p-1 text-2xl cursor-pointer opacity-0 animate-customFadeIn"
                                onClick={handleImageClick}
                            >
                                <Image
                                    src={`/avatar/${playerAvatar}.svg`}
                                    alt={`Avatar ${playerAvatar}`}
                                    width={30}
                                    height={30}
                                />
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div
                            className={`flex flex-col text-center items-center gap-4`}
                        >
                            <h1 className={`font-bold text-6xl`}>
                                <span className={`text-2xl`}>
                                    Bienvenue sur
                                    <br />
                                </span>
                                <span className="text-pink-300">Hi</span>
                                <span className="text-yellow-300">Fu</span>
                                <span className="text-teal-600">Mi</span>
                            </h1>
                            <p
                                className={`text-2xl transition-all  duration-700 md:w-2/3`}
                            >
                                Ici, vous pouvez défier vos amis ou des inconnus
                                dans une partie de 🪨 📃 ✂️.
                            </p>
                        </div>
                        <div className={`mt-16`}>
                            <Button
                                content="Let's&nbsp;go&nbsp;!"
                                onClick={handleButtonClick}
                            />
                        </div>
                    </>
                )}
            </header>
            <section
                className={`absolute top left-0 right-0 h-full w-full flex flex-col items-center justify-start z-10 grow pt-[50px] bg-green-300 transition-all duration-700 ${
                    !isSet ? "top-0" : "top-[-100%]"
                }`}
            >
                <form
                    action=""
                    className="flex flex-col px-10 mt-auto mb-auto"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitPlayer();
                    }}
                >
                    <div className="flex flex-col gap-14 p-10 bg-blue-300 border-2 border-black rounded-sm mb-16">
                        <div className="flex flex-col items-start justify-center gap-1 ">
                            <label
                                htmlFor="playerName"
                                className="text-xl font-semibold"
                            >
                                Nom du joueur
                            </label>
                            <input
                                className="border-b-2 border-black bg-transparent text-base pb-1 focus-visible::border-b-2 focus-visible::border-black focus-visible::outline-none"
                                aria-label="Player Name"
                                type="text"
                                value={playerName}
                                onChange={handleNameChange}
                            />
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1 text-xl">
                            <label
                                htmlFor="playerAvatar"
                                className="pb-4 text-xl font-semibold"
                            >
                                Avatar
                            </label>
                            <ul className="avatar-list flex flex-row items-center justify-evenly gap-4 w-full text-base flex-wrap">
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <li
                                        key={num}
                                        className={`p-1 rounded-full bg-white border-2 border-white hover:border-black transition-all duration-300 ${
                                            playerAvatar == num
                                                ? "!border-black"
                                                : ""
                                        }`}
                                    >
                                        <label htmlFor={`P${num}`}>
                                            <input
                                                id={`P${num}`}
                                                className="hidden"
                                                aria-label={`P${num}`}
                                                type="radio"
                                                name="playerAvatar"
                                                value={num}
                                                checked={playerAvatar == num}
                                                onChange={handleAvatarChange}
                                            />
                                            <Image
                                                src={`/avatar/${num}.svg`}
                                                alt={`Avatar ${num}`}
                                                width={50}
                                                height={50}
                                            />
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        content="Prêt&nbsp;!"
                        onClick={handleSubmitPlayer}
                    />
                </form>
            </section>
            <main className="relative h-full w-full flex flex-col items-center justify-start grow pt-[50px] bg-orange-300">
                <div className="flex flex-col px-10 mt-auto mb-auto gap-9 md:gap-16 py-4">
                    <div className="flex flex-col items-center gap-3 md:mb-3">
                        <Image
                            src={`/avatar/master.svg`}
                            alt={`Avatar Salon`}
                            width={60}
                            height={60}
                            className="p-3 md:mb-5 bg-white border-2 border-black rounded-full"
                        />
                        <p className="text-justify font-semibold md:w-2/3">
                            Vous êtes prêt à entrer dans l&apos;arène et à
                            tester vos compétences au Pierre-Papier-Ciseaux !
                            <br />
                            <br />
                            Préparez-vous à affronter vos adversaires et à
                            démontrer votre maîtrise du jeu. Que le meilleur
                            joueur gagne !
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-10 mb-4">
                        <Button
                            content="Défier&nbsp;un&nbsp;ami"
                            onClick={debounce(playWithFriend, 300)}
                        />

                        <Button
                            content="Défier&nbsp;un&nbsp;inconnu"
                            onClick={debounce(playWithRandomPlayer, 300)}
                        />

                        <div className="lg:hidden">
                            <Button
                                content="À&nbsp;propos"
                                onClick={debounce(toggleModal, 300)}
                            />
                        </div>
                    </div>
                </div>
                <dialog
                    open={isModalOpen}
                    className={`w-screen h-full z-50 fixed inset-0 bg-white transition-transform transform ${
                        isModalOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                >
                    <div className="absolute top-3 right-4 z-50">
                        <button
                            onClick={toggleModal}
                            className="text-2xl font-bold bg-white border-2 border-black rounded-full w-10 h-10 flex items-center justify-center"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <About className="w-full h-full  pt-4" />
                    </div>
                </dialog>
            </main>
        </DesktopUI>
    );
}
