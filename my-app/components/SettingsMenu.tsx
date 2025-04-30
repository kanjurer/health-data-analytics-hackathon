'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function SettingsMenu() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="top-4 right-4 z-50 absolute" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-100 hover:bg-gray-200 dark:bg-[#1e2732] dark:hover:bg-[#2f3336] p-2 rounded-full transition"
      >
        <Settings size={18} />
      </button>

      {open && (
        <div className="bg-white dark:bg-[#1e2732] shadow-xl mt-2 border border-gray-200 dark:border-gray-700 rounded-xl w-48 overflow-hidden">
          <button
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#2f3336] px-4 py-3 w-full text-sm text-left transition"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </div>
  );
}
