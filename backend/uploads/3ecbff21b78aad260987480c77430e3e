import type { Metadata } from "next";
import {
  Inter,
  Manrope,
  Raleway,
  Comfortaa,
  DM_Sans,
  Instrument_Sans,
  Quicksand,
  Zilla_Slab,
} from "next/font/google";
import "./globals.css";

// Define fonts with CSS variable names
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans" });
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrumentsans",
});
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
// const zillaSlab = Zilla_Slab({ subsets: ["latin"], variable: "--font-zillaslab" });

export const metadata: Metadata = {
  title: "Ayunext",
  description: "Empowering Innovation, Finance, and Growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${raleway.variable} ${comfortaa.variable} ${dmSans.variable} ${instrumentSans.variable} ${quicksand.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
