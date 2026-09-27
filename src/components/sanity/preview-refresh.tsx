'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PreviewRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [router]);

  return null;
}
