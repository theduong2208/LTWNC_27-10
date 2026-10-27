import Link from 'next/link';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '403 - Quyền truy cập bị từ chối',
  description: 'Bạn không có quyền truy cập vào trang này.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
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
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: '45px 35px',
          borderTop: '6px solid var(--danger)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}
        >
          <ShieldX size={40} />
        </div>

        <span
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--danger)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '8px',
          }}
        >
          403 FORBIDDEN
        </span>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}>
          Bạn không có quyền truy cập khu vực Quản trị!
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          Khu vực <strong>/admin</strong> chỉ dành riêng cho <strong>Lớp trưởng (Admin)</strong> để thêm và xoá deadline.
          Tài khoản hiện tại của bạn là Sinh viên (role: user) nên bị từ chối truy cập theo Ma trận phân quyền.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn btn-primary">
            <Home size={16} />
            <span>Về Dashboard sinh viên</span>
          </Link>
          <Link href="/deadlines" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Xem Danh sách Deadline</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
