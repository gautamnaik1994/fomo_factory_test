import { Server, Socket } from "socket.io";
import { stockPriceCollection } from "../db/conn";

interface Subscriptions {
  [key: string]: NodeJS.Timeout;
}

async function fetchPriceData(symbol: string, limit = 1) { 
  const priceData = await stockPriceCollection?.aggregate(
    [
      {
        "$match": {
          "metadata.symbol": symbol,
        }
      },
      {
        "$sort": {
          "timestamp": -1
        }
      },
      {
        "$limit": limit
      },
      {
        "$project": {
          "_id": 0,
          "timestamp": 1,
          "price": 1,
          "symbol": "$metadata.symbol"
        }
      
      }
    ]).toArray();

  console.log(`Emitting price update for ${symbol} :  ${JSON.stringify(priceData)}`);
  return priceData;
}

const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected: Total Clients: ", io.engine.clientsCount);
    const subscriptions: Subscriptions = {};

    socket.on('subscribe', async (symbol: string) => {
      console.log(`User subscribed to ticker: ${symbol}`);

      if (subscriptions[symbol]) {
        return;
      }

      socket.emit('priceUpdate', await fetchPriceData(symbol, 5));
      const intervalId = setInterval(async () => {
        // const priceData = [{ timestamp:new Date(), symbol, price: Math.random() * 100 }];
        socket.emit('priceUpdate', await fetchPriceData(symbol));
      }, process.env.DATA_INGESTION_INTERVAL_SECONDS? parseInt(process.env.DATA_INGESTION_INTERVAL_SECONDS) * 1000 + 5000 : 15000);
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
