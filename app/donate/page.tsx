"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeftIcon,
    HeartIcon,
    CoffeeIcon,
    SparklesIcon,
    RocketIcon,
    CheckIcon,
} from "lucide-react";

const DONATION_TIERS = [
    {
        id: "coffee",
        name: "Buy us a coffee",
        amount: "$5",
        icon: CoffeeIcon,
        description: "Support our journalism",
        popular: false,
    },
    {
        id: "supporter",
        name: "Supporter",
        amount: "$15",
        icon: HeartIcon,
        description: "Help us grow",
        popular: true,
    },
    {
        id: "champion",
        name: "Champion",
        amount: "$50",
        icon: RocketIcon,
        description: "Make a big impact",
        popular: false,
    },
];

export default function DonatePage() {
    const [selectedTier, setSelectedTier] = React.useState("supporter");
    const [isDonating, setIsDonating] = React.useState(false);
    const [isDone, setIsDone] = React.useState(false);

    const handleDonate = async () => {
        setIsDonating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsDonating(false);
        setIsDone(true);
    };

    return (
        <div className="animate-fade-in max-w-xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="mb-8 text-muted-foreground hover:text-violet-500"
            >
                <Link href="/">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back
                </Link>
            </Button>

            {isDone ? (
                /* Success State */
                <Card className="border-green-500/20">
                    <CardContent className="pt-12 pb-12">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckIcon className="h-8 w-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-semibold">Thank you! 💜</h1>
                            <p className="text-muted-foreground">
                                Your support means everything to us.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (This is a demo - no payment was processed)
                            </p>
                            <Button asChild className="mt-4 bg-violet-500 hover:bg-violet-600 text-white">
                                <Link href="/">Back to News</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* Donation Form */
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                            <HeartIcon className="h-6 w-6 text-pink-500 fill-current" />
                        </div>
                        <h1 className="text-2xl font-bold">Support Newsroom</h1>
                        <p className="text-muted-foreground">
                            Help us keep quality journalism free and accessible
                        </p>
                    </div>

                    {/* Tiers */}
                    <div className="grid gap-3">
                        {DONATION_TIERS.map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => setSelectedTier(tier.id)}
                                className={`relative flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${selectedTier === tier.id
                                        ? "border-violet-500 bg-violet-500/5"
                                        : "border-border hover:border-violet-500/50"
                                    }`}
                            >
                                {tier.popular && (
                                    <span className="absolute -top-2 right-3 px-2 py-0.5 text-xs font-medium bg-violet-500 text-white rounded-full">
                                        Popular
                                    </span>
                                )}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedTier === tier.id ? "bg-violet-500/10" : "bg-muted"
                                    }`}>
                                    <tier.icon className={`h-5 w-5 ${selectedTier === tier.id ? "text-violet-500" : "text-muted-foreground"
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{tier.name}</p>
                                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                                </div>
                                <span className={`text-lg font-bold ${selectedTier === tier.id ? "text-violet-500" : ""
                                    }`}>
                                    {tier.amount}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">or enter custom amount</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-background focus:border-violet-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Donate Button */}
                    <Button
                        onClick={handleDonate}
                        disabled={isDonating}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white h-12 text-base"
                    >
                        {isDonating ? (
                            <SparklesIcon className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <HeartIcon className="h-4 w-4 mr-2 fill-current" />
                                Donate Now
                            </>
                        )}
                    </Button>

                    {/* Disclaimer */}
                    <p className="text-center text-xs text-muted-foreground">
                        🔒 Secure payment • This is a demo mockup
                    </p>
                </div>
            )}
        </div>
    );
}
