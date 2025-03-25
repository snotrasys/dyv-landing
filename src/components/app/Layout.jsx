import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';
import { useSpinner } from '@/context/SpinnerContext';
import LoadingSpinner from '@/utils/LoadingSpinner';


export function Layout({
  children,

  title,
  description,
  type,
  url,
  ogImage,
  date,
  titleAppendSiteName = true,
  noIndex = false,
}) {
  useEffect(() => {
    document.documentElement.lang = 'en';
  });
  const { isSpinnerShown, spinnerMessage } = useSpinner();
  return (
    <div

  >

      <div className="">
        <NextSeo
          title={title}
          description={description}
          titleTemplate={titleAppendSiteName ? `%s` : undefined}
          openGraph={{
            title,
            description,
            type,
            url,
            images: ogImage ? [ogImage] : undefined,
            article: {
              publishedTime: date,
            },
          }}
          canonical={url}
          noindex={noIndex}
        />

        {isSpinnerShown && <LoadingSpinner>{spinnerMessage}</LoadingSpinner>}
        {children}
      </div>
    </div>
  );
}
