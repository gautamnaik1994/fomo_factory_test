import express from "express";
import { stockPriceCollection } from "../db/conn";
import {client as redisClient} from '../redis/index';

const router = express.Router();

router.get("/:symbol", async (req, res) => {

  const symbol = req.params.symbol;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;

  const cachedData = await redisClient.get(
    `priceData:${symbol}:${limit}`
  );

  if (cachedData) {
    res.json({
      data: JSON.parse(cachedData),
      message: "Price data fetched successfully from cache",
    });
    return;
  }

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
  
  // if (!priceData) {
  //   res.status(404).json({
  //     message: "Price data not found",
  //   });
  //   return;
  // }

  await redisClient.set(
    `priceData:${symbol}:${limit}`,
    JSON.stringify(priceData),
    {"EX":process.env.DATA_INGESTION_INTERVAL_SECONDS ? parseInt(process.env.DATA_INGESTION_INTERVAL_SECONDS) + 5000 : 15}
  );
  
  res.json({
    data: priceData,
    message: "Price data fetched successfully",
  });
});

export default router;