"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/server/better-auth/client"; // ✅ important

export default function LoginPage() {
	const router = useRouter();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await signIn.email({
			email: form.email,
			password: form.password,
			callbackURL: "/main/dashboard",
		});

		setLoading(false);

		if (result?.error) {
			setError("Invalid email or password");
			return;
		}

		router.push("/main/dashboard");
	}

	return (
		<Card className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-lg">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-2xl tracking-tight">Welcome Back</h1>
				<p className="text-muted-foreground text-sm">Login to continue</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label>Email</Label>
					<Input
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
						type="email"
						value={form.email}
					/>
				</div>

				<div className="space-y-2">
					<Label>Password</Label>
					<Input
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
						type="password"
						value={form.password}
					/>
				</div>

				{error && <p className="text-center text-red-500 text-sm">{error}</p>}

				<Button className="w-full rounded-xl" disabled={loading} type="submit">
					{loading ? "Logging in..." : "Login"}
				</Button>
			</form>

			<p className="text-center text-muted-foreground text-sm">
				Don’t have an account?{" "}
				<Link className="underline" href="/auth/signup">
					Sign up
				</Link>
			</p>
		</Card>
	);
}
