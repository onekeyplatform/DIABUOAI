import './globals.css';
import type { Metadata, ReactNode } from 'next';

export const metadata: Metadata = {
  title: 'DIABUOAI',
  description: 'Enterprise AI platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
