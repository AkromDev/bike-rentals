import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, NormalizeCSS, GlobalStyles } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import '../global.css';

import dynamic from 'next/dynamic';
import initAuth from 'src/firebase/initAuth';

const ProgressBar = dynamic(() => import('src/components/ProgessBar'), { ssr: false });

initAuth();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <Head>
        <title>Bike rentals</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          fontFamily: 'Inter, sans-serif',
          headings: {
            fontFamily: 'Inter, sans-serif',
          },
        }}
      >
        <NormalizeCSS />
        <GlobalStyles />
        <NotificationsProvider position="top-right">
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
      <ProgressBar />
    </>
  );
}
