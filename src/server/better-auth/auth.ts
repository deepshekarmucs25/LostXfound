import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "../db/schema";
import { db } from "../db";

// server/auth.ts (or your Better Auth config file)
// in your auth server config
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: user,
            session: session,
            account: account,
            verification: verification
        }
    }),
    // ADD THIS SECTION:
    user: {
        additionalFields: {
            role: { type: "string" },
            address: { type: "string" }
        }
    },
    emailAndPassword: {
        enabled: true
    }
});