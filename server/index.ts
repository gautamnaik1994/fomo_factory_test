import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();
import { startPriceDataIngestion } from './src/data_ingestion/priceData';
import { connectToDatabase, initializeCollections } from './src/db/conn';
import {connectRedis} from './src/redis/index';
import handleSocketConnection from './src/socket_server/io';
import price from './src/routes/price';

(async () => {
  try {
    await connectRedis();
    await connectToDatabase();
    await initializeCollections();
    startPriceDataIngestion();
  } catch (error) {
    console.error(error);
  }
})();


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

handleSocketConnection(io);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/price', price);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
