import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Class Deadline Hub - Cổng Deadline Học viện Công nghệ Bưu chính Viễn thông PTIT',
    template: '%s | Class Deadline Hub PTIT',
  },
  description:
    'Hệ thống quản lý, theo dõi và nhắc hẹn deadline học tập cho lớp học viện PTIT. Hỗ trợ SSG, ISR 60s, SSR và phân quyền NextAuth bảo mật.',
  keywords: ['deadline hub', 'ptit', 'học viện bưu chính viễn thông', 'quản lý deadline', 'nextjs', 'isr', 'ssg'],
  authors: [{ name: 'Lớp trưởng PTIT' }],
  openGraph: {
    title: 'Class Deadline Hub - Cổng Deadline Lớp PTIT',
    description: 'Xem deadline công khai, theo dõi tiến độ học tập và thông báo bài tập lớp PTIT.',
    url: 'http://localhost:3000',
    siteName: 'Class Deadline Hub PTIT',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.className}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
