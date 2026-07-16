import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLdSchema from "@/components/JsonLdSchema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gov Jobs, Tenders & Funding India — Official Resource Discovery Portal",
  description: "Discover verified government vacancies, national e-procurement tenders, state startup grants, and MSME subsidy programs across all Indian States and Union Territories.",
  keywords: [
    "Government Jobs India",
    "UPSC",
    "SSC",
    "State PSC Careers",
    "Government Tenders",
    "eProcurement",
    "Startup India Funding",
    "MSME Subsidies",
    "Central Government Directory"
  ],
  metadataBase: new URL("https://govjobs-tenders-funding.vercel.app"),
  openGraph: {
    title: "Gov Jobs, Tenders & Funding India — Discovery Portal",
    description: "Explore official jobs, procurement tenders, and innovation funding opportunities from authentic government sources in India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 text-gray-900`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <JsonLdSchema type="Organization" data={{}} />
      </body>
    </html>
  );
}