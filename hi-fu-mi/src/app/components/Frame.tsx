"use client";

import { Children } from "react";

interface frameProps {
    children: React.ReactNode;
    className: string;
}

const Frame = ({ children, className }: frameProps) => {
    const circleData = [
        { color: "text-blue-300", animation: "animate-scalePulse-0" },
        { color: "text-pink-300", animation: "animate-scalePulse-500" },
        { color: "text-yellow-300", animation: "animate-scalePulse-1000" },
    ];

    return (
        <div className={`relative ${className}`}>
            <div className="flex flex-col items-center h-auto border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                <div className="flex flex-col gap-1 p-8 w-full">{children}</div>
            </div>
            <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-pink-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
            <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-yellow-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
        </div>
    );
};

export default Frame;
