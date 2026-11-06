import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db("WanderlastDB");

client.connect()
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

export const auth = betterAuth({
  appName: "Wanderlast",

  // Better Auth public URL
  baseURL: process.env.BETTER_AUTH_URL,

  // Authentication secret
  secret: process.env.BETTER_AUTH_SECRET,

  // Allowed frontend origins
  trustedOrigins: [
    "http://localhost:3000",
    "https://wanderlast-frontend-nu.vercel.app",
  ],

  database: mongodbAdapter(db, {
    client,
  }),
//jwt implements
  plugins: [
    jwt(),
  ],

  //session cookies
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60,
    },
  },

  //email and password
  emailAndPassword: {
    enabled: true,
  },
});

//comment