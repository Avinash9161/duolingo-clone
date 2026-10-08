import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Duolingo Clone - Learn Languages Free",
  description: "A modern Duolingo Web Application Clone",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      {/* Added responsive layout container and standard dark mode support classes */}
      <body className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#131F24] text-[#4b4b4b] dark:text-gray-200">
        <Suspense fallback={<aside className="w-full md:w-64 border-r-2 border-duo-gray h-20 md:h-screen"></aside>}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 flex flex-col items-center overflow-y-auto pb-24 md:pb-0">{children}</main>
      </body>
    </html>
  );
}