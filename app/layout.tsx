import type { Metadata, Viewport } from 'next';
import { Allura, Cormorant_Garamond, Montserrat } from 'next/font/google';
import { EVENT_CONFIG } from '@/js/config';
import './globals.css';

const serif = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const sans = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const script = Allura({
  variable: '--font-script',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://allison-xv-invitacion.jolly-krill-0577.chatgpt.site',
  ),
  title: `Mis XV | ${EVENT_CONFIG.quinceanera.nombreCompleto}`,
  description: 'Te invito a compartir conmigo una noche mágica.',
  openGraph: {
    title: `Mis XV · ${EVENT_CONFIG.quinceanera.nombre}`,
    description: 'Te invito a compartir conmigo una noche mágica.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `Mis XV · ${EVENT_CONFIG.quinceanera.nombre} — Una noche mágica comienza` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Mis XV · ${EVENT_CONFIG.quinceanera.nombre}`,
    description: 'Te invito a compartir conmigo una noche mágica.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#12382D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`}>
        {children}
      </body>
    </html>
  );
}
