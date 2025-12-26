import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Newsroom",
    template: "%s • Newsroom",
  },
  description: "Modern minimal news & blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div className="min-h-dvh flex flex-col">
              <SiteHeader />
              <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
                {children}
              </main>
              <SiteFooter />
            </div>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
