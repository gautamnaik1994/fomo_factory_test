import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import { createServer } from "http";


import dotenv from "dotenv";
dotenv.config();
import { startPriceDataIngestion } from './src/data_ingestion/priceData';
import { connectToDatabase, initializeCollections } from './src/db/conn';
import test from './src/routes/test';

// connectToDatabase().then(() => {
//   initializeCollections();
// }).catch(console.error);

function getRandomPrice(symbol: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const price = Math.random() * 100;
      resolve({ symbol, price });
    }, 1000);
  });
}


// startPriceDataIngestion();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket) => {
  console.log("A user connected", io.engine.clientsCount);
  const subscriptions = new Map();
  socket.on('subscribeToTicker', (symbol) => {
    console.log(`User subscribed to ticker: ${symbol}`);

    if (subscriptions.has(symbol)) {
      return;
    }

    const intervalId = setInterval(async () => {
      const priceData = { symbol, price: Math.random() * 100 };
      console.log(`Emitting price update for ${symbol}: ${priceData.price}`);
      socket.emit('priceUpdate', priceData);
    }, 1000);

    subscriptions.set(symbol, intervalId);

    socket.on('disconnect', () => {
      subscriptions.forEach((intervalId) => clearInterval(intervalId));
      console.log('user disconnected');
    });
  });
  socket.on('unsubscribe', (symbol) => {
    if (subscriptions.has(symbol)) {
      clearInterval(subscriptions.get(symbol));
      subscriptions.delete(symbol);
    }
  })

});



const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/test', test);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
