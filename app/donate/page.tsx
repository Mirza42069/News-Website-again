"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowLeftIcon,
    HeartIcon,
} from "lucide-react";
import { PricingTable, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function DonatePage() {
    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
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

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                    <HeartIcon className="h-6 w-6 text-violet-500 fill-current" />
                </div>
                <h1 className="text-2xl font-bold">Support Newsroom</h1>
                <p className="text-muted-foreground">
                    Help us keep quality journalism free and accessible
                </p>
            </div>

            <SignedIn>
                {/* Clerk Pricing Table with violet theme override */}
                <div 
                    className="pricing-table-violet"
                    style={{
                        // Override Clerk's default colors with violet
                        ['--cl-color-primary' as any]: 'rgb(139, 92, 246)', // violet-500
                        ['--cl-color-primary-hover' as any]: 'rgb(124, 58, 237)', // violet-600
                    }}
                >
                    <PricingTable />
                </div>
            </SignedIn>

            <SignedOut>
                <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">
                        Sign in to view subscription plans and support us
                    </p>
                    <SignInButton mode="modal">
                        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                            <HeartIcon className="h-4 w-4 mr-2 fill-current" />
                            Sign in to Subscribe
                        </Button>
                    </SignInButton>
                </div>
            </SignedOut>

            {/* Secure Payment Note */}
            <p className="text-center text-xs text-muted-foreground mt-8">
                🔒 Secure payment via Clerk Billing
            </p>
        </div>
    );
}
