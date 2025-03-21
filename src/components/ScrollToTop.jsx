import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function useScrollToTop() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }, 0);
  }, [router.pathname]);
}
