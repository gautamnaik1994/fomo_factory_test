import express from "express";
import {stockPriceCollection} from "../db/conn";

const router = express.Router();

router.get("/", async (req, res) => {
  // const tasks = await (db ? db.collection("stock_prices").find({}).limit(10).toArray() : []);
  const priceData = await stockPriceCollection?.aggregate(
    [
      {
        "$match": {
          "metadata.symbol": "BTC",
        }
      },
      {
        "$sort": {
          "timestamp": -1
        }
      },
      {
        "$limit": 1
      },
      {
        "$project": {
          "_id": 0,
          "timestamp": 1,
          "price": 1
        }
      
      }
    ]).toArray();

  console.log(`Emitting price update for ${JSON.stringify(priceData)}`);
  res.json(priceData);
});

export default router;