import { Server, Socket } from "socket.io";
import { stockPriceCollection } from "../db/conn";

interface Subscriptions {
  [key: string]: NodeJS.Timeout;
}

async function fetchPriceData(symbol: string, limit = 1) {
  //following query fetches the latest price data for the given symbol
  const priceData = await stockPriceCollection?.aggregate([
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

  if (!priceData) {
    console.log(`No price data found for ${symbol}.Check if database is connected. Returning null`);
    return null
  }

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

      //First call fetches 20 items and sends it to the client
      socket.emit('priceUpdate', await fetchPriceData(symbol, 20));
      const intervalId = setInterval(async () => {
        // const priceData = [{ timestamp:new Date(), symbol, price: Math.random() * 100 }];
        socket.emit('priceUpdate', await fetchPriceData(symbol));

        //interval is set at a time that is slightly more than the data ingestion interval to prevent duplicate data
      }, process.env.DATA_INGESTION_INTERVAL_SECONDS ? parseInt(process.env.DATA_INGESTION_INTERVAL_SECONDS) * 1000 + 5000 : 15000);
      subscriptions[symbol] = intervalId;
    });

    socket.on('unsubscribe', (symbol: string) => {
      console.log(`User unsubscribed from ticker: ${symbol}`);
      if (subscriptions[symbol]) {
        clearInterval(subscriptions[symbol]);
        delete subscriptions[symbol];
      }
    });

    socket.on('disconnect', () => {
      Object.values(subscriptions).forEach(clearInterval);
      console.log('User disconnected');
    });
  });
};

export default handleSocketConnection;
