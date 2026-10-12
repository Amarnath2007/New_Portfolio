import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amarnath B | Portfolio",
  description: "Problem Solver | Developer | BCA Student at PSG CAS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#0B0B0C] text-[#F4F0E8] overflow-x-hidden antialiased selection:bg-[#C7A46A]/20 selection:text-[#F4F0E8]">
        {children}
      </body>
    </html>
  );
}
