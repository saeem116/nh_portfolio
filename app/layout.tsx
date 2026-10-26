import type { Metadata } from "next";
import {
  Anton,
  Bodoni_Moda,
  Dancing_Script,
  Inter,
  League_Gothic,
  Mrs_Saint_Delafield,
  Playfair_Display,
} from "next/font/google";
import "../src/globals.css";
import "../src/fonts.css";
import { PageReveal } from "../src/components/PageReveal";
import { ScrollReveal } from "../src/components/ScrollReveal";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-league-gothic",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
});

const signature = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "NH Pavel | Video Editor & Motion Designer",
  description:
    "Portfolio of NH Pavel, a professional video editor specializing in storytelling, color grading, motion graphics, and sound design.",
  openGraph: {
    title: "NH Pavel — Video Editor",
    description: "Portfolio of NH Pavel, a professional video editor specializing in storytelling, color grading, motion graphics, and sound design.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NH Pavel — Video Editor",
    description: "Portfolio of NH Pavel, a professional video editor specializing in storytelling, color grading, motion graphics, and sound design.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${leagueGothic.variable} ${inter.variable} ${playfair.variable} ${bodoni.variable} ${dancing.variable} ${signature.variable}`}
    >
      <head>
        <noscript>
          <style>{`[data-anim]{animation:none!important;opacity:1!important;translate:none!important;clip-path:none!important;scale:none!important}.reveal-hidden,.reveal-hidden-fade{opacity:1!important;translate:none!important}[data-reveal]{opacity:1!important;translate:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-ink text-text">
        {children}
        <PageReveal />
        <ScrollReveal />
      </body>
    </html>
  );
}
