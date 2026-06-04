import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PATH — Palo Alto Trading Hub',
  description: 'The complete course on AI trading — from first feature to a live, monitored strategy.',
};

/**
 * Root layout — wraps every page.
 *
 * - Loads Manrope + Archivo Black + JetBrains Mono from Google Fonts.
 * - Sets the dark/light theme from localStorage BEFORE the body paints
 *   (avoids the flash of wrong theme on reload).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Archivo+Black&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('path.theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body className="relative">{children}</body>
    </html>
  );
}
