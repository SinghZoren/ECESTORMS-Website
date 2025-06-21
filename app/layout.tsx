import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import ContentSwitcher from './components/ContentSwitcher';
import CircuitTransition from './components/CircuitTransition';
import Footer from './components/Footer';
import ResponsiveSocialSidebar from './components/ResponsiveSocialSidebar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ECESTORMS - Electrical And Computer Course Union',
  description: 'Electrical and Computer Engineering Course Union for Toronto Metropolitan Students',
  icons: {
    icon: [
      {
        url: '/favicon.ico?v=3',
        sizes: 'any',
      },
      {
        url: 'favicon.ico?v=3',
        sizes: 'any',
      }
    ],
    shortcut: ['/favicon.ico?v=3'],
    apple: ['/favicon.ico?v=3'],
  },
};

export default function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ResponsiveSocialSidebar />
          <main className="flex-grow relative">
            <CircuitTransition>
              <ContentSwitcher />   
            </CircuitTransition>
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
