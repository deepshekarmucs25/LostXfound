"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/server/better-auth/client";

export default function SignupPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		role: "student",
	});

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { error: authError } = await signUp.email({
				email: form.email,
				password: form.password,
				name: form.name,
				callbackURL: "/auth/login",
				// @ts-expect-error - 'data' mapping is handled in auth.ts
				data: {
					role: form.role,
				},
			});

			if (authError) {
				setError(authError.message || "Signup failed");
			} else {
				router.push("/auth/login");
			}
		} catch (_err) {
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			{/* Increased max-w-lg to max-w-xl for more width */}
			<Card className="w-full max-w-xl space-y-8 rounded-2xl p-10 shadow-xl">
				<div className="space-y-2 text-center">
					<h1 className="font-bold text-3xl tracking-tight">Create Account</h1>
					<p className="text-base text-muted-foreground">
						Join the quiz platform to start learning or teaching
					</p>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								name="name"
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								placeholder="John Doe"
								required
								value={form.name}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								name="email"
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								placeholder="name@example.com"
								required
								type="email"
								value={form.email}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								placeholder="••••••••"
								required
								type="password"
								value={form.password}
							/>
						</div>
					</div>

					{error && (
						<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
							<p className="text-center font-medium text-destructive text-sm">
								{error}
							</p>
						</div>
					)}

					<Button
						className="h-11 w-full font-semibold text-base"
						disabled={loading}
						type="submit"
					>
						{loading ? "Creating your account..." : "Sign Up"}
					</Button>
				</form>

				<p className="text-center text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						className="font-semibold text-primary underline underline-offset-4"
						href="/auth/login"
					>
						Login
					</Link>
				</p>
			</Card>
		</div>
	);
}
