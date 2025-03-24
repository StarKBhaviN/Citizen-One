import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ComplaintsProvider } from "@/context/ComplaintsContext";
import { DashboardProvider } from "@/context/DashboardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citizen Complaint Management System",
  description:
    "A platform for citizens to submit and track complaints to government departments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ComplaintsProvider>
            <AuthProvider>
              <DashboardProvider>{children}</DashboardProvider>
              <Toaster />
            </AuthProvider>
          </ComplaintsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
