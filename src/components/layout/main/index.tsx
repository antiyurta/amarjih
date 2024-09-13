import Head from 'next/head';
// import styles from './main.module.scss';
import Company from '@datas/company.json';

export default function MainLayout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="description" content="Эмнэлэг үндэсний төв" />
        <meta name="title" content="Эмнэлэг" />
        <meta name="category" content="Эмнэлэг" />
        <meta name="subject" content="Эмнэлэг" />
        <meta name="keywords" content="Эмнэлэг үндэсний төв" />
        <meta property="og:title" key="ogtitle" content="Эмнэлэг үндэсний төв" />
        <meta property="og:locale" key="oglocale" content="mn_MN" />
        <meta property="og:locality" content="Ulaanbaatar" />
        <meta property="og:region" content="UB" />
        <meta property="og:country-name" content="Mongolia" />
        <meta property="og:type" key="ogtype" content="website" />
        <meta property="og:description" key="ogdesc" content="Эмнэлэг үндэсний төв" />
        <title>Эмнэлэг - процесс</title>
      </Head>
      <main>{children}</main>
    </>
  );
}
