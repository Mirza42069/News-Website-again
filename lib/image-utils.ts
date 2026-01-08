export function sanitizeImageUrl(url: string | undefined): string {
  if (!url) return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"; // Fallback news image

  // Check for the known broken Unsplash URL with the space/encoding issue
  if (url.includes("photo-1461896836934-") && (url.includes("voices") || url.includes("%20voices"))) {
    return "/images/sports-victory.png";
  }

  return url;
}
