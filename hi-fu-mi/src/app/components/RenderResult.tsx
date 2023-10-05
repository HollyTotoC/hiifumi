import React from "react";

interface RenderResultProps {
    textContent: string;
}

const RenderResult = ({ textContent }: RenderResultProps) => {
    return (
        <div className="absolute animate-scoreDisplay">
            <div className="relative">
                <div className="flex flex-col items-center h-fit text-center border-2 border-black bg-white relative z-[4] translate-x-[-0.5rem] translate-y-[-0.5rem]">
                    <p className="text-4xl px-10 py-2 font-bold">
                        {textContent}
                    </p>
                </div>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-violet-300 rounded-sm z-[3] translate-x-0 translate-y-0"></span>
                <span className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-green-300 rounded-sm z-[2] translate-x-2 translate-y-2"></span>
            </div>
        </div>
    );
};

export default RenderResult;
