import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, NormalizeCSS, GlobalStyles } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import '../global.css';

import initAuth from 'utils/initAuth';

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
    </>
  );
}
