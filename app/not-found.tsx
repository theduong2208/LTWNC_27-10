import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
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
          <AlertCircle size={36} />
        </div>

        <span
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: 'var(--primary)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '10px',
          }}
        >
          404
        </span>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
          Không tìm thấy trang hoặc Deadline!
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Mã deadline hoặc đường dẫn bạn đang tìm kiếm không tồn tại trên hệ thống hoặc đã bị xoá bởi Lớp trưởng.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            <span>Về Trang chủ</span>
          </Link>
          <Link href="/deadlines" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Xem Deadline khác</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
