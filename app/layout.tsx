import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper />
      </body>
    </html>
  );
}
