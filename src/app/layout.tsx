import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'REBOOT Gaming Café | Mhow',
  description: 'Your Game. Your Zone. Your Rules. Premium anime-inspired gaming lounge in Mhow.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 font-sans selection:bg-pink-500 selection:text-white antialiased">
        {/* Cinematic Atmospheric Glows */}
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]"></div>
        </div>
        <main className="relative z-10 min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
