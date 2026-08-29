import type { Metadata } from "next";
import { Instrument_Serif, Archivo } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rocío Romero — Content Creator & UGC",
  description:
    "Videos y fotos con estética natural que no parecen publicidad. Content creator y UGC en Texas, USA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
