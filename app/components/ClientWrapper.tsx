'use client';

import ClientLayout from './ClientLayout';
import Head from 'next/head';
import { ModalVisibilityProvider } from './ModalVisibilityContext';

export default function ClientWrapper() {
  return (
    <>
      <Head>
        <title>ECESTORMS</title>
        <meta name="description" content="ECESTORMS Website" />
      </Head>
      <ModalVisibilityProvider>
        <ClientLayout />
      </ModalVisibilityProvider>
    </>
  );
} 