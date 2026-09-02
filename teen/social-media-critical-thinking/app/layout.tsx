import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const description =
  'Ten practical antidotes for the unconscious attention traps behind social media feeds.';
const siteUrl = 'https://attention-lab-antidotes.cwroyds.chatgpt.site';
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '10 Social Media Antidotes',
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: '10 Social Media Antidotes',
    description,
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: socialImage,
        width: 1731,
        height: 909,
        alt: '10 Social Media Antidotes — Think clearly before you click.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '10 Social Media Antidotes',
    description,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
