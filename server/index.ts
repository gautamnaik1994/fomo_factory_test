import express, { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from './db/conn';
import test from './routes/test';


connectToDatabase().catch(console.error);

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