import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from '../app/store';
import { Provider } from 'react-redux';
import { useEffect, useState } from "react";
import { socket } from "../services/socket";

// interface SocketType {
//   connected: boolean;
//   io: {
//     engine: {
//       transport: {
//         name: string;
//       };
//       on: (event: string, callback: (transport: UpgradedTransport) => void) => void;
//     };
//   };
//   on: (event: string, callback: () => void) => void;
//   off: (event: string, callback: () => void) => void;
// }

// interface UpgradedTransport {
//   name: string;
// }

export default function App({ Component, pageProps }: AppProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket?.io.engine.transport.name||"N/A");

      socket?.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
    };
  }, []);

  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>;
}
