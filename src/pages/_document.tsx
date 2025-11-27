import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Interactive Sign Language Learning Platform for deaf and hard-of-hearing students" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
