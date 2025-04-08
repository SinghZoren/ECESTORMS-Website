import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import ContentSwitcher from './components/ContentSwitcher';
import CircuitTransition from './components/CircuitTransition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ECESTORMS - Electrical And Computer Course Union',
  description: 'Electrical and Computer Engineering Course Union for Toronto Metropolitan Students',
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <CircuitTransition>
          <ContentSwitcher />
        </CircuitTransition>
      </body>
    </html>
  );
}
