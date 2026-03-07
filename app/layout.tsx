// import type { Metadata } from "next";
// import { Crimson_Pro, DM_Sans } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";

// const crimsonPro = Crimson_Pro({
//   subsets: ["latin"],
//   weight: ["300", "400", "600"],
//   style: ["normal", "italic"],
//   variable: "--font-display",
//   display: "swap",
// });

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
//   variable: "--font-body",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Da Hausa Initiative",
//     default: "Da Hausa Initiative – Simplifying Concepts, Strengthening Communities",
//   },
//   description:
//     "Da Hausa Initiative (DHI) works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria through research, training, and advocacy.",
//   keywords: [
//     "Da Hausa Initiative",
//     "financial literacy",
//     "data literacy",
//     "Northern Nigeria",
//     "Hausa",
//     "education",
//     "training",
//     "scholarship",
//   ],
//   openGraph: {
//     title: "Da Hausa Initiative",
//     description:
//       "Simplifying concepts, Strengthening communities — Financial & Data Literacy for Northern Nigeria",
//     siteName: "Da Hausa Initiative",
//     locale: "en_NG",
//     type: "website",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={`${crimsonPro.variable} ${dmSans.variable}`}>
//       <body className="font-body bg-white text-black antialiased">
//         {children}
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             style: {
//               background: "#000",
//               color: "#fff",
//               fontFamily: "var(--font-body)",
//               fontSize: "14px",
//             },
//             success: {
//               iconTheme: { primary: "#BF4E14", secondary: "#fff" },
//             },
//           }}
//         />
//       </body>
//     </html>
//   );
// }

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dhinitiative.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Da Hausa Initiative",
    default: "Da Hausa Initiative – Simplifying Concepts, Strengthening Communities",
  },
  description:
    "Da Hausa Initiative (DHI) improves financial and data literacy across Hausa-speaking communities in Northern Nigeria through research, training, and advocacy. Apply for courses and scholarships.",
  keywords: [
    "Da Hausa Initiative",
    "DHI",
    "financial literacy Nigeria",
    "data literacy Nigeria",
    "Northern Nigeria education",
    "Hausa language training",
    "Home CFO Course",
    "Hausa Tech Training Scholarship",
    "Future Focus with Lailah",
    "Excel Power BI Hausa",
    "Northern Nigeria scholarship",
    "financial literacy Hausa",
  ],
  authors: [{ name: "Da Hausa Initiative", url: siteUrl }],
  creator: "Da Hausa Initiative",
  publisher: "Da Hausa Initiative",
  category: "Education",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Da Hausa Initiative – Financial & Data Literacy for Northern Nigeria",
    description:
      "Simplifying concepts, Strengthening communities. DHI works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria.",
    url: siteUrl,
    siteName: "Da Hausa Initiative",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: `${siteUrl}/logo.jpeg`,
        width: 1200,
        height: 630,
        alt: "Da Hausa Initiative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Da Hausa Initiative – Financial & Data Literacy for Northern Nigeria",
    description:
      "Improving financial and data literacy across Hausa-speaking communities in Northern Nigeria.",
    images: [`${siteUrl}/logo.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ie7gDiaTymbvvS50g9YggQ0cYOGlp9rm5tMw0jQZuSc",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${dmSans.variable}`}>
      <head>
        <link rel="canonical" href={siteUrl} />
      </head>
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