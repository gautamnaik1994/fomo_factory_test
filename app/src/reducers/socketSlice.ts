import { createSlice } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client';


let socket: Socket | null = null;

export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        value: "BTC",
        priceData: [
            {
                date: '2024-05-01',
                price: 10
            },
            {
                date: '2024-05-02',
                price: 2000
            }
        ]
    },
    reducers: {
        connect: (state, action) => {

            const URL = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
                : 'http://localhost:8080';

            socket = io(URL, {
                autoConnect: true,
                reconnection: true,
                transports: ['websocket'],
                upgrade: false,
                forceNew: true,
            });
            socket.on('connect', () => {
                console.log('connected');
            });
            socket.on('priceUpdate', (data) => {
                state.priceData = data;
            });
        },
        disconnect: (state) => { 
            socket?.disconnect();
        },
        subscribe: (state, action) => {
            socket?.emit('subscribeToPrice', action.payload);
        },
        unsubscribe: (state, action) => {
            socket?.emit('unsubscribeToPrice', action.payload);
        }

    }
})

export const { connect, subscribe, unsubscribe , disconnect} = socketSlice.actions

export default socketSlice.reducer