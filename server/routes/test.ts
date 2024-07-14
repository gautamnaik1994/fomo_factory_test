import express from "express";
import {db} from "../db/conn";

const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await (db ? db.collection("stock_prices").find({}).toArray() : []);
  res.json(tasks);
});

export default router;