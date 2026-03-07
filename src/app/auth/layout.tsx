import "@/styles/globals.css";
import { Navbar } from "@/app/_components/navbar";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
				{children}
			</main>
		</>
	);
}
