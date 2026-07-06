'use client';

import dynamic from 'next/dynamic';

const FountainBuilder = dynamic(() => import('@/components/FountainBuilder'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-950 text-white">Loading fountain builder...</div>,
});

export default function Home() {
  return <FountainBuilder />;
}
