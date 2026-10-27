import Link from 'next/link';
import AuthButton from './AuthButton';
import { Calendar, LayoutDashboard, Clock, ShieldAlert, Home } from 'lucide-react';

export default function PublicHeader() {
  return (
    <header className="header-root">
      <div className="header-container">
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c21807 0%, #dc2626 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(194, 24, 7, 0.25)',
              flexShrink: 0,
            }}
          >
            <Clock size={20} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                color: '#0f172a',
                letterSpacing: '-0.3px',
              }}
            >
              Class Deadline Hub
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #fecaca',
                letterSpacing: '0.5px',
              }}
            >
              PTIT
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <Link href="/" className="nav-link">
            <Home size={15} />
            <span>Trang chủ</span>
            <span className="badge-tag-mini badge-tag-ssg">SSG</span>
          </Link>

          <Link href="/deadlines" className="nav-link">
            <Calendar size={15} />
            <span>Tất cả Deadline</span>
            <span className="badge-tag-mini badge-tag-isr">ISR 60s</span>
          </Link>

          <Link href="/dashboard" className="nav-link">
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
            <span className="badge-tag-mini badge-tag-ssr">SSR</span>
          </Link>

          <Link href="/admin" className="nav-link nav-link-admin">
            <ShieldAlert size={15} />
            <span>Quản trị</span>
            <span className="badge-tag-mini" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
              SSR
            </span>
          </Link>
        </nav>

        {/* User Account / Auth Section */}
        <div style={{ flexShrink: 0 }}>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
