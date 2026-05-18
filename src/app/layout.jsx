import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/store/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata = {
  title: "ConnectUs",
  description: "A modern social media platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
