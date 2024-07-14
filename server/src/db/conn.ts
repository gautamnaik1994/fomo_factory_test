import { MongoClient, Db, CreateCollectionOptions, Collection } from "mongodb";

const connectionString: string = process.env.ATLAS_URI || "mongodb://localhost:27017";
const client: MongoClient = new MongoClient(connectionString);

let db: Db | null = null;
let stockPriceCollection: Collection | null;

async function connectToDatabase(): Promise<Db> {
  if (db) {
    console.log("Using existing database connection");
    return db;
  }

  try {
    const conn = await client.connect();
    db = conn.db(process.env.DATABASE_NAME);
    console.log("Connected to the database");
    
    return db;
  } catch (e) {
    console.error("Failed to connect to the database", e);
    throw new Error("Failed to connect to the database");
  }
}

async function initializeCollections(): Promise<void> { 
  stockPriceCollection = await createCollection("stock_prices", {
    timeseries: {                  
      timeField: "timestamp",       
      metaField: "meta", 
      granularity: "minutes",
    },
    expireAfterSeconds: 60 * 60 * 24 * 7,
  });
}

async function closeDatabase(): Promise<void> {
  if (db) {
    await client.close();
    db = null;
    console.log("Closed the database connection");
  }
}

async function createCollection(collectionName: string, options: CreateCollectionOptions):  Promise<Collection | null> {
  if (!db) {
    throw new Error("Database connection not established");
  }

  if (!(await collectionExists(collectionName))) {
    const collection = await db.createCollection(collectionName, options);
    console.log(`Created collection: ${collectionName}`);
    return collection;
  } else {
    console.log(`Collection ${collectionName} already exists`);
    return db.collection(collectionName);
  }
}

async function collectionExists(collectionName: string): Promise<boolean> {
  if (!db) {
    throw new Error("Database connection not established");
  }
  const collections = await db.listCollections().toArray();
  return collections.some((collection) => collection.name === collectionName);
}


export { connectToDatabase, db , initializeCollections, stockPriceCollection};
