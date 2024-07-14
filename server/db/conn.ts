import { MongoClient, Db } from "mongodb";

const connectionString: string = process.env.ATLAS_URI || "mongodb://localhost:27017";
const client: MongoClient = new MongoClient(connectionString);

let db: Db | null = null;

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

export { connectToDatabase , db };
