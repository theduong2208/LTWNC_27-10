import React from 'react';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import { Clock, Home, Calendar } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* App Navbar */}
      <header className="header-root">
        <div className="header-container">
          {/* Logo & Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #c21807 0%, #dc2626 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(194, 24, 7, 0.25)',
                }}
              >
                <Clock size={19} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                Class Deadline Hub
              </span>
            </Link>

            <div
              style={{
                height: '20px',
                width: '1px',
                backgroundColor: 'var(--border)',
              }}
            />

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                backgroundColor: '#f1f5f9',
                padding: '3px 10px',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
              }}
            >
              Không gian Học tập
            </span>
          </div>

          {/* Quick nav & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <Link href="/" className="nav-link">
              <Home size={15} />
              <span>Trang chủ</span>
            </Link>
            <Link href="/deadlines" className="nav-link">
              <Calendar size={15} />
              <span>Xem Deadline</span>
            </Link>

            <div
              style={{
                height: '20px',
                width: '1px',
                backgroundColor: 'var(--border)',
              }}
            />

            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main App Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
