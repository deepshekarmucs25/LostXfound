import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Ensure this matches your environment (localhost for dev)
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
});

// Export the specific actions so you can use them directly in your components
export const { signIn, signUp, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;