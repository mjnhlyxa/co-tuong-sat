import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'co-tuong-sat - Vietnamese Chess',
  description: 'Cờ Tướng Sâm - Vietnamese Chess variant with Sâm Commander',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}