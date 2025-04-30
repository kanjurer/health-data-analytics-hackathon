// components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 mb-4 text-[#1d9bf0] hover:text-[#1a8cd8] dark:hover:text-blue-300 dark:text-blue-400 text-sm transition"
    >
      <ArrowLeft size={16} />
    </button>
  );
}
