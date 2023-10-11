"use client";

import React, {
    createContext,
    use,
    useContext,
    useEffect,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

type SocketProviderProps = {
    children: React.ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(
            process.env.REACT_APP_SOCKET_URL ||
                "https://main-bvxea6i-sgnfs6tkb2bvk.fr-3.platformsh.site"
        );
        setSocket(newSocket);
        console.log("Connected to the server!");

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
