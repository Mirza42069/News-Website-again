"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeftIcon,
    ImageIcon,
    XIcon,
    Loader2Icon,
    CheckIcon,
    SparklesIcon
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CreateNewsPage() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Redirect after showing success
        setTimeout(() => {
            router.push("/");
        }, 1500);
    };

    const isValid = title.trim().length > 0;

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
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

            <SignedOut>
                {/* Not signed in - show sign in prompt */}
                <Card className="border-violet-500/20">
                    <CardContent className="pt-12 pb-12">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <SparklesIcon className="h-8 w-8 text-violet-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold">Sign in to Create</h1>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    You need to be signed in to create and publish news articles.
                                </p>
                            </div>
                            <SignInButton mode="modal">
                                <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                                    Sign In to Continue
                                </Button>
                            </SignInButton>
                        </div>
                    </CardContent>
                </Card>
            </SignedOut>

            <SignedIn>
                {/* Signed in - show create form */}
                <Card className="border-violet-500/20">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create News Article</CardTitle>
                        <CardDescription>
                            Share your story with the world
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isSuccess ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckIcon className="h-8 w-8 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold">Article Published!</h2>
                                    <p className="text-muted-foreground">
                                        Redirecting to homepage...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    {imagePreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                variant="secondary"
                                                size="icon-sm"
                                                className="absolute top-2 right-2"
                                                onClick={removeImage}
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full aspect-video rounded-lg border-2 border-dashed border-violet-500/30 hover:border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/10 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-violet-500"
                                        >
                                            <ImageIcon className="h-10 w-10" />
                                            <span className="text-sm font-medium">Click to upload cover image</span>
                                            <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter a compelling headline..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-lg focus-visible:ring-violet-500"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Content</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Write your article content here..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={10}
                                        className="resize-none focus-visible:ring-violet-500"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Tip: Use ## for headings and - for bullet points
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push("/")}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                        className="bg-violet-500 hover:bg-violet-600 text-white flex-1 sm:flex-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            "Publish Article"
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </SignedIn>
        </div>
    );
}
