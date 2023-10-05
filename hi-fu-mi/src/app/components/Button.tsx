"ue client";

import React, { useState, useEffect } from "react";

interface ButtonProps {
    content: string;
    type?: "button" | "submit" | "reset" | undefined;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ content, onClick, type }: ButtonProps) => {
    const [decodedContent, setDecodedContent] = useState("");

    useEffect(() => {
        // Function to decode HTML entities
        const decodeHtmlEntities = (str: string) => {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = str;
            return textarea.value;
        };

        setDecodedContent(decodeHtmlEntities(content));
    }, [content]);

    return (
        <button className="group relative" onClick={onClick} type={type}>
            <div className="relative border-2 border-black rounded-sm p-3 text-lg font-bold z-[4] bg-white transform lg:translate-x-0 lg:translate-y-0 group-hover:translate-x-[-0.5rem] group-hover:translate-y-[-0.5rem] translate-x-[-0.5rem] translate-y-[-0.5rem] group-active:translate-x-[-0.25rem] group-active:translate-y-[-0.25rem] transition-transform duration-300">
                {decodedContent}
            </div>
            <div className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-pink-300 rounded-sm z-[3] translate-x-0 translate-y-0 group-hover:translate-x-0 group-hover:translate-y-0 group-active:translate-x-0 transition-transform duration-300"></div>
            <div className="absolute top-0 right-0 bottom-0 left-0 border-2 border-black bg-yellow-300 rounded-sm z-[2] transform lg:translate-x-0 lg:translate-y-0 translate-x-2 translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 group-active:translate-x-1 group-active:translate-y-1 transition-transform duration-300"></div>
        </button>
    );
};

export default Button;
