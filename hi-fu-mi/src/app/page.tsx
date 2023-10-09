"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./utils/socketContext";
import { useSearchParams } from "next/navigation";
import Button from "./components/Button";
import Image from "next/image";

export default function Home() {
    const router = useRouter();
    const socket = useSocket();
    const urlRoomId = useSearchParams().get("rid");

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
        } else if (playerName && playerAvatar && urlRoomId) {
            joinFriend();
        } else {
            alert("Please select a name and an avatar!");
        }
    };

    function handleImageClick() {
        setIsSet(false);
    }

    return (
        <>
            <header
                className={`z-20 absolute top-0 left-0 right-0 w-screen bg-white flex items-center justify-center flex-col border-b-2 border-opacity-1 ${
                    isActive
                        ? "h-full min-h-screen p-10 border-white"
                        : "animate-customBorder"
                }`}
            >
                {!isActive ? (
                    <div
                        className={`flex flex-row justify-between w-full opacity-0 ${
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
                                    Welcome to
                                    <br />
                                </span>
                                <span className="text-pink-300">Hi</span>
                                <span className="text-yellow-300">Fu</span>
                                <span className="text-teal-600">Mi</span>
                            </h1>
                            <p
                                className={`text-2xl transition-all  duration-700`}
                            >
                                Here you can challenge your friends or strangers
                                in a hi&#8209;fu&#8209;mi game.
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
                className={`absolute top left-0 right-0 h-[100vh] w-screen flex flex-col items-center justify-start z-10 grow pt-[50px] bg-green-300 transition-all duration-700 ${
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
                                Player Name
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
                                Player Avatar
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
                        content="Ready&nbsp;!"
                        onClick={handleSubmitPlayer}
                    />
                </form>
            </section>
            <main className="relative h-[100vh] w-screen flex flex-col items-center justify-start grow pt-[50px] bg-orange-300">
                <div className="flex flex-col px-10 mt-auto mb-auto gap-16">
                    <div className="flex flex-col items-center gap-3 mb-3">
                        <Image
                            src={`/avatar/1.svg`}
                            alt={`Avatar Salon`}
                            width={80}
                            height={80}
                            className="p-1 bg-white border-2 border-black rounded-full"
                        />
                        <p className="text-justify font-semibold">
                            You&apos;re ready to step into the arena and test
                            your skills in Rock Paper Scissors !<br />
                            Brace yourself to face your opponents and showcase
                            your mastery of the game. May the best player win !
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-10 mb-4">
                        <Button
                            content="Play&nbsp;with&nbsp;a&nbsp;friend"
                            onClick={playWithFriend}
                        />

                        <Button
                            content="Play&nbsp;random&nbsp;player"
                            onClick={playWithRandomPlayer}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
