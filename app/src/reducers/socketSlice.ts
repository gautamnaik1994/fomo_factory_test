import { createSlice } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Queue from '@/utils/Queue';
import { RootState } from '@reduxjs/toolkit/query';

let socket: Socket | null = null;


export const connectSocket = createAsyncThunk(
  'socket/connect',
  async (_, { dispatch, getState }) => {
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
        console.log('connected in thunk');
        //@ts-expect-error
        dispatch(subscribe(getState().socket.value));
    });

      socket.on('priceUpdate', (data) => {
        console.log('priceUpdate', data);
        dispatch(updatePriceData(data));
    });
  }
);

let priceQueue = new Queue(5);

type Payload = {
    timestamp: Date,
    price: number,
}[]

export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        value: "BTC",
        priceData:[]
    },
    reducers: {
        updatePriceData: (state, action: { payload: Payload }) => {
            priceQueue.enqueue(action.payload[0]);
            state.priceData = priceQueue.toArray() as never[];
        },
        disconnect: (state) => { 
            socket?.disconnect();
        },
        subscribe: (state, action) => {
            socket?.emit('unsubscribe', state.value);
            state.value = action.payload;
            priceQueue.clear();
            state.priceData = [];
            socket?.emit('subscribe', action.payload);
        },
        unsubscribe: (state, action) => {
            priceQueue.clear();
            state.priceData = [];
            socket?.emit('unsubscribe', action.payload);
            state.value = '';
        }
    },
    extraReducers: (builder, ) => {
        builder.addCase(connectSocket.fulfilled, (state, action) => {
            console.log('connected');
            
        });
    }
})

export const { updatePriceData, subscribe, unsubscribe , disconnect} = socketSlice.actions

export default socketSlice.reducer