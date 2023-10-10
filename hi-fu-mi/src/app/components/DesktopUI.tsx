import Frame from "./Frame";
import Image from "next/image";
import About from "./About";

interface DesktopUIProps {
    children: React.ReactNode;
}

const DesktopUI = ({ children }: DesktopUIProps) => {
    const techData = [
        { name: "Next.js 13", logo: "/logos/nextjs.svg" },
        { name: "React", logo: "/logos/react.svg" },
        { name: "Typescript", logo: "/logos/typescript.svg" },
        { name: "Tailwind CSS", logo: "/logos/tailwindcss.svg" },
        { name: "Socket.IO", logo: "/logos/socketio.svg" },
        { name: "Node.js", logo: "/logos/nodejs.svg" },
        { name: "Express", logo: "/logos/express.svg" },
    ];

    return (
        <div className="flex h-full grow items-stretch">
            <About className={`hidden h-screen lg:flex w-1/2`} />
            <div className="w-full flex min-h-screen lg:w-1/2 !bg-white relative grow">
                <div className="flex flex-col grow lg:mx-8 lg:my-14 relative overflow-hidden lg:border-2 lg:border-black">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DesktopUI;
