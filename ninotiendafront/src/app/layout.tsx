import "@/app/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/app/Provider";
import { JetBrains_Mono } from "next/font/google";


const jetBrains_Mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ninotraining",
  description: "sitio de entrenamiento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={jetBrains_Mono.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

