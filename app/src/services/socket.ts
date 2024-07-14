import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080' : 'http://localhost:8080';
const isBrowser = typeof window !== "undefined";

export const socket:Socket | null = isBrowser ? io(URL, {
    autoConnect: true,
    reconnection: true,
    transports: ['websocket'],
    upgrade: false,
    forceNew: true,
}) : null;