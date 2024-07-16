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

function formatDate(utcTimeString: string): string {
const utcDate: Date = new Date(utcTimeString);
const dateOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
};
const formattedDate: string = utcDate.toLocaleDateString(undefined, dateOptions);
const timeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};
const formattedTime: string = utcDate.toLocaleTimeString(undefined, timeOptions);
const formattedDateTime: string = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}

let priceQueue = new Queue(5);

type Payload = {
    timestamp: string,
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
            console.log('updatePriceData', action.payload);
            action.payload.forEach((item) => {
                item.timestamp = formatDate(item.timestamp)
                item.price = parseFloat(item.price.toFixed(5));
                priceQueue.enqueue(item);
            });
            state.priceData = priceQueue.toArray() as never[];
        },
        disconnect: (state) => { 
            socket?.disconnect();
        },
        subscribe: (state, action) => {
            socket?.emit('unsubscribe', state.value);
            state.value = action.payload;
            socket?.emit('subscribe', action.payload);
            priceQueue.clear();
            state.priceData = [];
        },
        unsubscribe: (state, action) => {
          socket?.emit('unsubscribe', action.payload);
            priceQueue.clear();
            state.priceData = [];
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