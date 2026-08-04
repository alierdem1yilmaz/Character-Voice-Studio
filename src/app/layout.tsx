import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Character Voice Studio",
  description: "Create a character and bring it to life with voice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 45% at 15% 10%, rgba(99,102,241,0.25), transparent 60%), " +
              "radial-gradient(50% 40% at 85% 15%, rgba(217,70,239,0.18), transparent 60%), " +
              "radial-gradient(60% 50% at 50% 100%, rgba(56,189,248,0.12), transparent 60%)",
          }}
        />
        {children}
      </body>
    </html>
  );
}
