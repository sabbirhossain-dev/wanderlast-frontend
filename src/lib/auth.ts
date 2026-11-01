import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("WanderlastDB");
client.connect()
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  //jwt plugin for token-based authentication
  plugins:[
    jwt()
  ],

   emailAndPassword: { 
    enabled: true, 
  },
});