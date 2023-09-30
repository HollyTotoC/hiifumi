"use client";
import React, { useState } from "react";
import Button from "./components/Button";
import Image from "next/image";

export default function Home() {
    const [isActive, setIsActive] = useState(true);
    const [isSet, setIsSet] = useState(false);
    const [playerProfile, setPlayerProfile] = useState({});
    const [playerName, setPlayerName] = useState("");
    const [playerAvatar, setPlayerAvatar] = useState(null);

    const handleButtonClick = () => {
        setIsActive(!isActive);
    };

    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const handleAvatarChange = (e) => {
        setPlayerAvatar(e.target.value);
    };

    const handleSubmitPlayer = (e) => {
        e.preventDefault();

        if (playerName && playerAvatar) {
            setPlayerProfile({
                id: Math.random().toString(36).substr(2, 9),
                name: playerName,
                avatar: playerAvatar,
            });
            setIsSet(true);
            console.log("playerProfile", playerProfile);
        } else {
            alert("Please select a name and an avatar!");
        }
    };

    console.log("isActive", isActive, playerName, playerAvatar);

    return (
        <>
            <header
                className={`z-20 absolute top-0 left-0 right-0 w-screen bg-white flex items-center justify-center flex-col border-b-2 border-opacity-1 ${
                    isActive
                        ? "h-full min-h-screen p-10 border-white"
                        : "animate-customBorder"
                }`}
            >
                <div className={`flex flex-col text-center items-center gap-4`}>
                    <h1
                        className={`font-bold transition-all duration-700 delay-700 ${
                            isActive ? "text-6xl" : "text-2xl"
                        }`}
                    >
                        <span
                            className={`text-2xl transition-all duration-700 ${
                                isActive
                                    ? " opacity-100"
                                    : "animate-customFadeOut"
                            }`}
                        >
                            Welcome to
                            <br />
                        </span>
                        <span className="text-pink-300">Hi</span>
                        <span className="text-yellow-300">Fu</span>
                        <span className="text-teal-600">Mi</span>
                    </h1>
                    <p
                        className={`text-2xl transition-all  duration-700 ${
                            isActive ? "opacity-100" : "animate-customFadeOut"
                        }`}
                    >
                        Here you can challenge your friends or strangers in a
                        hi&#8209;fu&#8209;mi game.
                    </p>
                </div>
                <div
                    className={`transition-all duration-700 delay-100 ${
                        isActive ? "opacity-100" : "animate-customFadeOut"
                    }`}
                >
                    <Button
                        content="Let's&nbsp;go&nbsp;!"
                        onClick={handleButtonClick}
                    />
                </div>
            </header>
            <section
                className={`absolute left-0 right-0 h-[100vh] w-screen flex flex-col items-center justify-start z-10 grow pt-[50px] bg-green-300 transition-all duration-700 ${
                    !isSet ? "top-0" : "top-[-100%]"
                }`}
            >
                <form
                    action=""
                    className="flex flex-col px-10 mt-auto mb-auto"
                    onSubmit={handleSubmitPlayer}
                >
                    <div className="flex flex-col gap-14 p-10 bg-blue-300 border-2 border-black rounded-sm">
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
                            <ul className="flex flex-row items-center justify-evenly gap-4 w-full text-base flex-wrap">
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <li
                                        key={num}
                                        className={`p-3 rounded-full bg-white border-2 border-white hover:border-black transition-all duration-300 ${
                                            playerAvatar == num
                                                ? "border-black"
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
                                                width={30}
                                                height={30}
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
            <section className="relative h-[100vh] w-screen flex flex-col items-center justify-start grow pt-[50px] bg-orange-300">
                <div className="flex flex-col px-10 mt-auto mb-auto">
                    <div>
                        <img src="" alt="" />
                        <p>
                            You&apos;re ready to step into the arena and test
                            your skills in Rock Paper Scissors ! Brace yourself
                            to face your opponents and showcase your mastery of
                            the game. May the best player win !
                        </p>
                    </div>
                    <Button
                        type=""
                        content="Play&nbsp;with&nbsp;a&nbsp;friend"
                        onClick={() => {}}
                    />
                    <Button
                        type=""
                        content="Play&nbsp;random&nbsp;player"
                        onClick={() => {}}
                    />
                </div>
            </section>
        </>
    );
}
