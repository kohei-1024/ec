import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';

import theme from '@/styles/theme';
import GlobalStyles from '@/styles/globalStyles';
import apolloClient from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>E-Commerce | Next.js + GraphQL</title>
        <meta name="description" content="E-commerce store built with Next.js and GraphQL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Component {...pageProps} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}
