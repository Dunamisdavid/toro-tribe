import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Footer } from '@/components/Footer';
import { Header, HeaderFallback } from '@/components/Header';
import { Overlays } from '@/components/Overlays';
import { Background, PageEffects } from '@/components/PageEffects';
import { Toasts } from '@/components/Toasts';
import { StoreProvider } from '@/lib/store';
// Self-hosted fonts (no Google Fonts request at build or run time)
import '@fontsource/unbounded/500.css';
import '@fontsource/unbounded/700.css';
import '@fontsource/unbounded/800.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './globals.css';


export const metadata: Metadata = {
  title: 'Toro Tribe — Earn by doing. Fulfill your Aspirations.',
  description: 'ToroTeams: the ToroNet community Work & Funding Engine. Claim bounties, grow your Integrity, become an Ambassador.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230A1C08'/%3E%3Cpath d='M4 6q3 7 7 8l5 12 5-12q4-1 7-8-4 4-8 4h-8Q8 10 4 6z' fill='%23C68642'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <Background />
        <Suspense fallback={<HeaderFallback />}>
          <StoreProvider>
            <PageEffects />
            <Header />
            <main id="view" className="view">{children}</main>
            <Footer />
            <Overlays />
            <Toasts />
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
