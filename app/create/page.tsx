"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
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
    SparklesIcon,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";

const CATEGORIES = ["Technology", "Business", "Science", "World", "Sports", "Health", "Entertainment"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function CreateNewsPage() {
    const router = useRouter();
    const { user } = useUser();
    const createArticle = useMutation(api.news.create);
    
    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [content, setContent] = React.useState("");
    const [category, setCategory] = React.useState("Technology");
    const [imageData, setImageData] = React.useState<string | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`Image too large! Maximum size is 1MB. Your file is ${formatFileSize(file.size)}`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setImagePreview(dataUrl);
            setImageData(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !excerpt.trim()) {
            toast.error("Please fill in the title and excerpt");
            return;
        }

        setIsSubmitting(true);

        try {
            const slug = generateSlug(title) + "-" + Date.now();
            const authorName = user?.fullName || user?.username || "Anonymous";
            const authorImage = user?.imageUrl;

            await createArticle({
                title: title.trim(),
                slug,
                excerpt: excerpt.trim(),
                content: content.trim() || excerpt.trim(),
                category,
                imageUrl: imageData || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
                author: authorName,
                authorImage: authorImage || undefined,
                featured: false,
                readTime: Math.ceil(content.split(/\s+/).length / 200) || 1,
            });

            setIsSuccess(true);
            toast.success("Article published successfully!");

            // Redirect after showing success
            setTimeout(() => {
                router.push("/search");
            }, 1500);
        } catch (error) {
            console.error("Failed to create article:", error);
            toast.error("Failed to publish article. Please try again.");
            setIsSubmitting(false);
        }
    };

    const isValid = title.trim().length > 0 && excerpt.trim().length > 0;

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
                                        Redirecting to all news...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label>Cover Image <span className="text-muted-foreground text-xs">(max 1MB)</span></Label>
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
                                            <span className="text-xs text-muted-foreground">PNG, JPG up to 1MB</span>
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

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat} className="bg-white text-gray-900">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="A brief summary of your article..."
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        rows={3}
                                        className="resize-none focus-visible:ring-violet-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Full Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write your article content here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
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
