import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'JuraganKos - Cari Kos & Apartemen Lebih Mudah',
  description: 'Temukan kos, apartemen, dan hunian sewa terbaik dengan harga terjangkau di JuraganKos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans text-gray-900 bg-gray-50 flex flex-col min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}