import express, { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import {startPriceDataIngestion} from './src/data_ingestion/priceData';
import { connectToDatabase, initializeCollections } from './src/db/conn';
import test from './src/routes/test';

connectToDatabase().then(() => {
  initializeCollections();
}).catch(console.error);


startPriceDataIngestion();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); 
app.use('/test', test);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});