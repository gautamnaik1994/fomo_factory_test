import { createSlice } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Queue from '@/utils/Queue';
import { formatDate } from '@/utils';

let socket: Socket | null = null;
let priceQueue = new Queue(20);

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
      console.log('connected');
      //@ts-expect-error
      dispatch(subscribe(getState().socket.value));
      dispatch(socketDisconnected(false));
    });

    socket.on('disconnect', () => { 
      console.log('disconnected');
      dispatch(socketDisconnected(true));
    });

    socket.on('priceUpdate', (data) => {
      console.log('priceUpdate', data);
      dispatch(updatePriceData(data));
      dispatch(animate());
    });
  }
);


type Payload = {
  timestamp: string,
  price: number,
}[]

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    value: "BTC",
    priceData: [],
    updateId: 0, // Used to trigger animation on data update
    socketDisconnected: true
  },
  reducers: {
    updatePriceData: (state, action: { payload: Payload }) => {

      if (!Array.isArray(action.payload)) {
        return;
      }
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
    },
    socketDisconnected: (state, action) => { 
     state.socketDisconnected = action.payload;
    },
    animate: (state) => { 
      state.updateId === 0 ? state.updateId = 1 : state.updateId = 0;
    }

  },
  extraReducers: (builder,) => {
    builder.addCase(connectSocket.fulfilled, (state, action) => {
      console.log('connected');
    });
  }
})

export const { updatePriceData, subscribe, unsubscribe, disconnect, animate, socketDisconnected } = socketSlice.actions

export default socketSlice.reducer