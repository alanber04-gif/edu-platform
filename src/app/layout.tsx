import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const siteUrl = "https://sahm-academy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "منصة سهم التعليمية | دورات وتعلّم إلكتروني",
    template: "%s | منصة سهم",
  },
  description:
    "منصة سهم التعليمية للتعلّم الإلكتروني واكتساب المهارات. اكتشف الدورات والدروس وتابع تقدّمك في تجربة تعليمية عربية سهلة.",
  applicationName: "منصة سهم التعليمية",
  keywords: [
    "منصة سهم",
    "سهم التعليمية",
    "دورات تعليمية",
    "التعليم الإلكتروني",
    "دورات أونلاين",
    "تعلم عن بعد",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    siteName: "منصة سهم التعليمية",
    title: "منصة سهم التعليمية | دورات وتعلّم إلكتروني",
    description:
      "تعلّم مهارات جديدة وتابع تقدّمك عبر تجربة تعليمية عربية مع منصة سهم.",
  },
  twitter: {
    card: "summary",
    title: "منصة سهم التعليمية",
    description: "تعلّم مهارات جديدة وتابع تقدّمك مع منصة سهم التعليمية.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
