import "./globals.css";
import LenisProvider from '../components/LenisProvider';
import CustomCursor from '../components/ui/CustomCursor';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://miteri.vercel.app'), // Replace with your actual domain
  title: {
    default: "Miteri Sports Center | Dharan's Premier All-in-One Sports Hub",
    template: "%s | Miteri Sports Center"
  },
  description: "Premium indoor futsal, basketball, gym, and badminton facilities in Dharan-11, Nepal. Book courts online 24/7. Modern equipment, professional coaching, and competitive rates.",
  keywords: ["futsal Dharan", "basketball court Dharan", "sports center Nepal", "Miteri Sports", "badminton court Dharan", "gym Dharan", "indoor sports Nepal", "book sports court online"],
  authors: [{ name: "Miteri Sports Center" }],
  creator: "Miteri Sports Center",
  publisher: "Miteri Sports Center",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://miteri.vercel.app',
    siteName: 'Miteri Sports Center',
    title: "Miteri Sports Center | Dharan's Premier All-in-One Sports Hub",
    description: "Premium indoor futsal, basketball, gym, and badminton facilities in Dharan-11, Nepal. Book courts online 24/7.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Miteri Sports Center - Premier Sports Facilities in Dharan',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Miteri Sports Center | Dharan's Premier All-in-One Sports Hub",
    description: "Premium indoor futsal, basketball, gym, and badminton facilities in Dharan-11, Nepal.",
    images: ['/og-image.jpg'],
    creator: '@miterisports', // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://miteri.verel.app',
  },
  verification: {
    google: 'ti1_pW68KeXu5FW-Fkxdsod33q1-ykGRy8fyIwpos2M',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F4F0' },
    { media: '(prefers-color-scheme: dark)', color: '#080909' },
  ],
};

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'Miteri Sports Center',
    description: 'Premium indoor futsal, basketball, gym, and badminton facilities in Dharan-11, Nepal.',
    url: 'https://miteri.vercel.app',
    logo: 'https://miteri.vercel.app/logo.jpg',
    image: 'https://miteri.vercel.app/og-image.jpg',
    telephone: '+977-XXX-XXXXXXX', // Add actual phone
    email: 'info@miteri.vercel.app', // Add actual email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dharan-11',
      addressLocality: 'Dharan',
      addressRegion: 'Province 1',
      postalCode: '56700',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.8153, // Add actual coordinates
      longitude: 87.2847,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '06:00',
        closes: '22:00',
      },
    ],
    priceRange: '$$',
    sameAs: [
      'https://facebook.com/miterisports', // Add actual social links
      'https://instagram.com/miterisports',
      'https://twitter.com/miterisports',
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Futsal Court' },
      { '@type': 'LocationFeatureSpecification', name: 'Basketball Court' },
      { '@type': 'LocationFeatureSpecification', name: 'Badminton Court' },
      { '@type': 'LocationFeatureSpecification', name: 'Gym' },
      { '@type': 'LocationFeatureSpecification', name: 'Online Booking' },
    ],
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[#080909] text-[#F4F4F0] font-sans antialiased">
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Custom Cursor */}
        <CustomCursor />
        
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
