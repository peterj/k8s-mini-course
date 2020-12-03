import { Author, Header, Hero, Layout, Module, Unit } from '@components/index';
import {
  author,
  ogImage,
  siteDescription,
  siteName,
  websiteUrl,
} from '@config';
import useLocalStorage from '@hooks/useLocalStorage';
import { getAllPosts } from '@lib/api';
import Head from 'next/head';
import React from 'react';

export default function Home({ allPosts }) {
  const [progress] = useLocalStorage('progress', []);

  return (
    <Layout>
      <Head>
        <title>{`${siteName} by ${author}`}</title>
        <link rel='icon' href='/favicon.png' />
        <meta
          name='description'
          content={siteDescription}
          key='descriptionMeta'
        />
        <meta property='og:url' content={websiteUrl} key='url' />
        <meta property='og:type' content='website' key='website' />
        <meta
          property='og:title'
          content={`${siteName} by ${author}`}
          key='title'
        />
        <meta property='og:image' content={ogImage} key='image' />
        <meta
          property='og:description'
          content={siteDescription}
          key='description'
        />
      </Head>
      <main className='min-h-full col-span-8 col-start-2 p-4 bg-white sm:p-8'>
        <Header />
        <Hero />
        {allPosts && (
          <ol className='mb-4'>
            {allPosts.map((unit, index) => {
              const isCompleted = progress.find((u) => u.path === unit.slug);
              const item = unit.module ? (
                <React.Fragment key={unit.module}>
                  <Module module={unit.module} />
                  <Unit index={index} unit={unit} isCompleted={isCompleted} />
                </React.Fragment>
              ) : (
                <Unit
                  key={unit.slug}
                  index={index}
                  unit={unit}
                  isCompleted={isCompleted}
                />
              );
              return item;
            })}
          </ol>
        )}
        <Author />
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'slug',
    'module',
    'order',
    'coverImage',
    'excerpt',
  ]);

  return {
    props: { allPosts },
  };
}
