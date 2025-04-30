import { ThemeProvider } from '@/providers/ThemeProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SettingsMenu from '@/components/SettingsMenu';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vaccine Hesitancy Simulator',
  description: 'Track how tweets shape opinions about vaccines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-[#f5f8fa] dark:bg-[#15202b] text-[#0f1419] dark:text-white"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <main className="w-full min-h-screen">
          <ThemeProvider>
            <SettingsMenu />
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
