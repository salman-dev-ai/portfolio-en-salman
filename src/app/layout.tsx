// الملف: layout.tsx
// الوظيفة: التخطيط الجذري لتطبيق Next.js يضبط اللغة والاتجاه والخطوط والبيانات الوصفية.
// المحتوى: metadata للـ SEO و personJsonLd ومكوّن RootLayout مع روابط خطوط Google.
// الاعتماديات: next (Metadata) و index.css و React.ReactNode للأبناء.
import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Salman Al-Ansi | AI Engineer, Web Developer & Mobile App Developer',
  description:
    'Personal portfolio of Salman Al-Ansi, AI Engineer, Web Developer & Mobile App Developer. Building intelligent solutions with AI, Next.js, and Mobile technologies.',
  openGraph: {
    title: 'Salman Al-Ansi | AI Engineer, Web Developer & Mobile App Developer',
    description:
      'Personal portfolio of Salman Al-Ansi, AI Engineer, Web Developer & Mobile App Developer. Building intelligent solutions with AI, Next.js, and Mobile technologies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salman Al-Ansi | AI Engineer, Web Developer & Mobile App Developer',
    description:
      'Personal portfolio of Salman Al-Ansi, AI Engineer, Web Developer & Mobile App Developer. Building intelligent solutions with AI, Next.js, and Mobile technologies.',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-180x180.png',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Salman Al-Ansi',
  jobTitle: 'AI Engineer, Web Developer & Mobile App Developer',
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Next.js',
    'React',
    'React Native',
    'Flutter',
    'TypeScript',
  ],
  sameAs: ['https://github.com/salman-dev-ai', 'https://www.linkedin.com/in/salman-al-ansi-93ab92397'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Fonts: Plus Jakarta Sans (Latin), Cairo (Arabic), Caveat (Handwritten annotations) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FDFBF7] text-[#080D12] dark:bg-[#03070B] dark:text-[#F3F4F6] transition-colors duration-200 antialiased selection:bg-[#FF641C] selection:text-white">
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
