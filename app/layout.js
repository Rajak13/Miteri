import "./globals.css";
import LenisProvider from '../components/LenisProvider';

export const metadata = {
  title: "Miteri Sports Center | Dharan's Premier All-in-One Sports Hub",
  description: "Premium indoor futsal, basketball, gym, and badminton facilities in Dharan-11, Nepal. Book a court online.",
  keywords: "futsal Dharan, basketball court Dharan, sports center Nepal, Miteri Sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#080909] text-[#F4F4F0] font-sans antialiased"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
