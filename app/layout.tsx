import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shell/theme-provider";
import { SkinAttribute } from "@/components/shell/skin-attribute";
import { WalkthroughOverlay } from "@/components/shell/walkthrough-overlay";
import { WalkthroughAdvancer } from "@/components/shell/walkthrough-advancer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces is used as the display face on the marketing landing and
// on AR-side greeting copy as a subliminal "different shoes" cue.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Lending Agent Oversight",
  description:
    "An operating system for principal firms supervising Appointed Representatives. Composite risk scoring, breach workflow with FCA timing, file review with regulatory rubric, annual fitness review packets.",
  metadataBase: new URL("https://lending-agent-oversight.vercel.app"),
  openGraph: {
    title: "Lending Agent Oversight",
    description:
      "An operating system for principal firms supervising Appointed Representatives.",
    siteName: "Lending Agent Oversight",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground relative isolate"
        data-skin="heritage"
      >
        <ThemeProvider>
          <SkinAttribute />
          <WalkthroughAdvancer />
          <div className="relative z-10 flex flex-col flex-1">{children}</div>
          <WalkthroughOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
