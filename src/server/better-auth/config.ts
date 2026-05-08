import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "@/server/db/schema";
import { env } from "@/env";
import { db } from "@/server/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    trustedOrigins: [
        "https://lost-xfound.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
    ],
    user: {
        additionalFields: {
            role: { type: "string" },
            address: { type: "string" },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
            redirectURI: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
        },
    },
});

export type Session = typeof auth.$Infer.Session;
