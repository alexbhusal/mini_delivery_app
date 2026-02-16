import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { tokenStorage } from "../store/storage";
import { refresh_tokens } from "./apiInterceptors";
import { SOCKET_URL } from "./config";

interface WSService {
  initializeSocket: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListener: (listenerName: string) => void;
  updateAccessToken: () => Promise<void>;
  disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketAccessToken, setSocketAccessToken] = useState<string | null>(
    null,
  );
  const socket = useRef<Socket | null>(null);

  // Initial token setup
  useEffect(() => {
    const loadToken = async () => {
      const token = await tokenStorage.getItem("access_token");
      if (token) setSocketAccessToken(token);
    };
    loadToken();
  }, []);

  // (Re)initialize socket when token changes
  useEffect(() => {
    if (!socketAccessToken) return;

    if (socket.current) {
      socket.current.disconnect();
    }

    socket.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        access_token: socketAccessToken,
      },
    });

    socket.current.on("connect_error", async (error: any) => {
      if (error.message === "Authentication error") {
        console.log("Auth error", error.message);
        try {
          await refresh_tokens();
          const newToken = await tokenStorage.getItem("access_token");
          if (newToken) {
            setSocketAccessToken(newToken);
          }
        } catch (e) {
          console.error("Failed to refresh token", e);
        }
      }
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [socketAccessToken]);

  const socketService: WSService = {
    initializeSocket: async () => {
      const token = await tokenStorage.getItem("access_token");
      if (token) {
        setSocketAccessToken(token);
      }
    },
    emit: (event, data) => {
      socket.current?.emit(event, data);
    },
    on: (event, cb) => {
      socket.current?.on(event, cb);
    },
    off: (event) => {
      socket.current?.off(event);
    },
    removeListener: (listenerName) => {
      socket.current?.off(listenerName);
    },
    updateAccessToken: async () => {
      await refresh_tokens();
      const token = await tokenStorage.getItem("access_token");
      if (token) setSocketAccessToken(token);
    },
    disconnect: () => {
      socket.current?.disconnect();
    },
  };

  return (
    <WSContext.Provider value={socketService}>{children}</WSContext.Provider>
  );
};

// Optional hook for easier use
export const useWS = (): WSService => {
  const socketService = useContext(WSContext);
  if (!socketService) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return socketService;
};
