import { Server, Socket } from "socket.io";

interface Subscriptions {
  [key: string]: NodeJS.Timeout;
}

const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", io.engine.clientsCount);
    const subscriptions: Subscriptions = {};

    socket.on('subscribeToTicker', (symbol: string) => {
      console.log(`User subscribed to ticker: ${symbol}`);

      if (subscriptions[symbol]) {
        return;
      }

      const intervalId = setInterval(async () => {
        const priceData = { date:new Date(), symbol, price: Math.random() * 100 };
        console.log(`Emitting price update for ${symbol}: ${priceData.price}`);
        socket.emit('priceUpdate', priceData);
      }, 1000);

      subscriptions[symbol] = intervalId;
    });

    socket.on('unsubscribe', (symbol: string) => {
      if (subscriptions[symbol]) {
        clearInterval(subscriptions[symbol]);
        delete subscriptions[symbol];
      }
    });

    socket.on('disconnect', () => {
      Object.values(subscriptions).forEach(clearInterval);
      console.log('user disconnected');
    });
  });
};

export default handleSocketConnection;
