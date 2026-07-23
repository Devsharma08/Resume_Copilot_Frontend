import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Copilot — AI Resume Reviewer & ATS Analyzer",
  description: "AI-powered Career Copilot that analyzes your resume, scores ATS compatibility, and generates customized cover letters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
        <QueryProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />
            
            {/* Right main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <Header />
              
              {/* Actual page content wrapper */}
              <main className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-5xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
