import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/store/ReduxProvider";
import Head from "next/head"; 

export const metadata = {
  title: "ConnectUs", 
  description: "A modern social media platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <body className="antialiased">
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
