import { type Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

// 1. Force load the env
dotenv.config({ path: path.join(process.cwd(), ".env") });

// 2. Validate it's actually the Neon URL (should NOT be localhost)
const dbUrl = process.env.DATABASE_URL;
console.log("Connecting to:", dbUrl?.split('@')[1] || "No URL Found"); 

if (!dbUrl) {
  throw new Error("DATABASE_URL is missing from .env file");
}

export default {
    schema: "./src/server/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl, // Pass the variable we just validated
    },
    // Keep this matching your schema's pgTableCreator
    tablesFilter: ["pg-drizzle_*"], 
} satisfies Config;