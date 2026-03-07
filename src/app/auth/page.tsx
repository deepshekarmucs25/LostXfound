import {
    Search,
    HandHelping,
    MapPin,
    MessageSquare,
    BellRing,
    ShieldCheck,
    History,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/better-auth";

export default async function LandingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="container mx-auto space-y-12 px-6 py-12">
            {/* Hero / Header Section */}
            <div className="space-y-4 text-center">
                <Badge className="rounded-full border-indigo-200 bg-indigo-100 px-4 py-1 text-indigo-700 text-sm">
                    Reconnecting people with their belongings
                </Badge>

                <h1 className="bg-gradient-to-r from-indigo-900 to-slate-700 bg-clip-text font-extrabold text-5xl text-transparent tracking-tight">
                    Lost it? Found it. Reconnected.
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    LostXFound is a centralized community platform designed to help you 
                    report lost items, list found belongings, and securely chat with others 
                    to return items to their rightful owners.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <Link href={session ? "/main/dashboard" : "/auth/signup"}>
                        <Button
                            className="rounded-full px-8 shadow-lg transition-all hover:shadow-xl bg-indigo-600 hover:bg-indigo-700"
                            size="lg"
                        >
                            {session ? "View Dashboard" : "Join the Community"}
                        </Button>
                    </Link>
                    <Link href="/main/lost-items">
                        <Button variant="outline" className="rounded-full px-8" size="lg">
                            Browse Items
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Smart Search */}
                <Card className="rounded-3xl border-slate-200/60 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-indigo-600" /> Smart Search
                        </CardTitle>
                        <CardDescription>Filtering made simple</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>
                            Quickly filter through thousands of listings by category, 
                            date, or keywords to find exactly what you're looking for.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>Category-based sorting</li>
                            <li>Advanced keyword search</li>
                            <li>Status tracking (Active/Resolved)</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Geo-Location */}
                <Card className="rounded-3xl border-slate-200/60 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-rose-500" /> Map Pinning
                        </CardTitle>
                        <CardDescription>
                            Location-based recovery
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>
                            Pin the exact location where an item was lost or found. 
                            Our integrated maps help narrow down the search area.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>Precise GPS coordinates</li>
                            <li>City & Country tagging</li>
                            <li>Visual map integration</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Secure Messaging */}
                <Card className="rounded-3xl border-slate-200/60 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-emerald-600" /> Secure Chat
                        </CardTitle>
                        <CardDescription>Safe communication</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>
                            Connect with finders or owners through our built-in 
                            messaging system without sharing your private contact info.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>Real-time chat updates</li>
                            <li>Image sharing in messages</li>
                            <li>Last-seen message tracking</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="rounded-3xl border-slate-200/60 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BellRing className="h-5 w-5 text-amber-500" /> Instant Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>
                            Get notified the moment someone messages you or when an 
                            item matching your description is posted.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>Item match notifications</li>
                            <li>New message alerts</li>
                            <li>Resolution updates</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="rounded-3xl border-slate-200/60 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-cyan-600" /> Verified Trust
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>
                            We prioritize safety with email verification and report 
                            systems to ensure a clean, honest community for everyone.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            <li>Better Auth integration</li>
                            <li>Community report system</li>
                            <li>Protected user profiles</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Mission Card */}
                <Card className="rounded-3xl border-none bg-indigo-900 text-indigo-50 shadow-sm transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <History className="h-5 w-5" /> Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-indigo-200">
                        <p>
                            We believe that technology should be used to bring out the 
                            best in people. LostXFound is built on the spirit of honesty.
                        </p>
                        <p className="font-semibold text-white italic">
                            Searchable. Safe. Supportive.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}