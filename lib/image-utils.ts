export function sanitizeImageUrl(url: string | undefined): string {
  if (!url) return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"; // Fallback news image

  // Check for the known broken Unsplash URL with the space/encoding issue
  // This URL has "- voices" or "-%20voices" which is broken
  if (url.includes("photo-1461896836934")) {
    return "/images/sports-victory.png";
  }

  // Check for any URL with encoded spaces that might cause issues
  if (url.includes("-%20") || url.includes("- ")) {
    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
  }

  return url;
}
