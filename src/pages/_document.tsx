import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <link href="/favicon.ico" rel="icon" type="image/png" sizes="32x32" />
          <meta name="theme-color" content="#317EFB" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
             <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P6R6QJK"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
