import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL);

async function clientPromise() {
  if (!client.isConnected()) await client.connect();
  return client;
}

export default clientPromise;
