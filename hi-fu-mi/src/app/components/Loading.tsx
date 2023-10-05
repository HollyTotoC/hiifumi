"use client";

import React from "react";
import { BsCircleFill } from "react-icons/bs";

interface loadingProps {
    textContent: string;
}

const Loading = ({ textContent }: loadingProps) => {
    const circleData = [
        { color: "text-blue-300", animation: "animate-scalePulse-0" },
        { color: "text-pink-300", animation: "animate-scalePulse-500" },
        { color: "text-yellow-300", animation: "animate-scalePulse-1000" },
    ];
    return (
        <div className="relative w-2/3">
            <div className="flex flex-col items-center h-fit gap-2 p-2 text-center border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                <p className="text-xl font-bold">{textContent}</p>
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
    );
};

export default Loading;
