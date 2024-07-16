import express from "express";
import { stockPriceCollection } from "../db/conn";

const router = express.Router();

router.get("/:symbol", async (req, res) => {

  const symbol = req.params.symbol;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;

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
  
  res.json({
    data: priceData,
    message: "Price data fetched successfully",
  });
});

export default router;