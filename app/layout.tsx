import type { Metadata } from "next";
import { Crimson_Pro, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Da Hausa Initiative",
    default: "Da Hausa Initiative – Simplifying Concepts, Strengthening Communities",
  },
  description:
    "Da Hausa Initiative (DHI) works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria through research, training, and advocacy.",
  keywords: [
    "Da Hausa Initiative",
    "financial literacy",
    "data literacy",
    "Northern Nigeria",
    "Hausa",
    "education",
    "training",
    "scholarship",
  ],
  openGraph: {
    title: "Da Hausa Initiative",
    description:
      "Simplifying concepts, Strengthening communities — Financial & Data Literacy for Northern Nigeria",
    siteName: "Da Hausa Initiative",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-black antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#BF4E14", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
