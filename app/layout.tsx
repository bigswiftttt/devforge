import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
// ...existing imports

export const metadata: Metadata = {
  metadataBase: new URL("https://devforge-ms.vercel.app"),
  title: {
    default: "DevForge | Command Center for your Codebase",
    template: "%s | DevForge",
  },
  description: "AI-powered repository intelligence platform — parse structure, visualize architecture and dependencies, and get AI-generated engineering insights.",
  openGraph: {
    title: "DevForge | Command Center for your Codebase",
    description: "AI-powered repository intelligence platform — parse structure, visualize architecture and dependencies, and get AI-generated engineering insights.",
    url: "https://devforge-ms.vercel.app",
    siteName: "DevForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevForge | Command Center for your Codebase",
    description: "AI-powered repository intelligence platform.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('devforge-theme') || 'dark';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}