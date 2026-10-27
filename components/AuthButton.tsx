'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogIn, LogOut, Shield, CheckCircle } from 'lucide-react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid #cbd5e1',
            borderTopColor: '#c21807',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Đang tải...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="btn btn-primary btn-sm"
        style={{
          padding: '7px 16px',
          fontSize: '0.86rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(194, 24, 7, 0.2)',
        }}
      >
        <LogIn size={15} />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  const role = session.user.role;
  const isAdmin = role === 'admin';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {/* User Info Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 10px 4px 6px',
          borderRadius: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Avatar Circle */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isAdmin
              ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.82rem',
            boxShadow: isAdmin
              ? '0 2px 6px rgba(220, 38, 38, 0.25)'
              : '0 2px 6px rgba(37, 99, 235, 0.25)',
            flexShrink: 0,
          }}
        >
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* Name and Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', lineHeight: 1.2 }}>
          <span
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#0f172a',
              whiteSpace: 'nowrap',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={session.user.name || ''}
          >
            {session.user.name}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                backgroundColor: isAdmin ? '#fee2e2' : '#dbeafe',
                color: isAdmin ? '#991b1b' : '#1e40af',
                border: `1px solid ${isAdmin ? '#fecaca' : '#bfdbfe'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                lineHeight: 1.2,
              }}
            >
              {isAdmin ? <Shield size={9} /> : <CheckCircle size={9} />}
              <span>{isAdmin ? 'Lớp trưởng' : 'Sinh viên'}</span>
            </span>

            {session.user.classCode && (
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {session.user.classCode}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#475569',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.color = '#0f172a';
          e.currentTarget.style.borderColor = '#94a3b8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = '#475569';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
        title="Đăng xuất khỏi hệ thống"
      >
        <LogOut size={14} />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
