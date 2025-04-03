'use client';

import ClientLayout from './ClientLayout';
import Head from 'next/head';

export default function ClientWrapper() {
  return (
    <>
      <Head>
        <title>ECESTORMS</title>
        <meta name="description" content="ECESTORMS Website" />
      </Head>
      <ClientLayout />
    </>
  );
} 