'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error boundary captured:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 30px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}
        >
          <AlertTriangle size={36} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>
          Đã xảy ra lỗi không mong muốn!
        </h2>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error.message || 'Hệ thống gặp sự cố trong quá trình xử lý yêu cầu của bạn.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-primary">
            <RotateCcw size={16} />
            <span>Thử lại</span>
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={16} />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
