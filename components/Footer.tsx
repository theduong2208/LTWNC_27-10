import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
        marginTop: '60px',
        padding: '35px 0 25px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              Class Deadline Hub - Học viện Công nghệ Bưu chính Viễn thông (PTIT)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dự án thực hành môn Lập trình Web Nâng cao (INT1434) - Buổi 7 & Buổi 8
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ textDecoration: 'underline' }}>Trang chủ</Link>
            <Link href="/deadlines" style={{ textDecoration: 'underline' }}>Danh sách Deadline</Link>
            <Link href="/dashboard" style={{ textDecoration: 'underline' }}>Không gian Sinh viên</Link>
            <Link href="/admin" style={{ textDecoration: 'underline' }}>Khu vực Quản trị</Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-light)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            Tài khoản mẫu: <strong>admin@ptit.edu.vn</strong> (admin123) | <strong>sv@ptit.edu.vn</strong> (sv123456)
          </div>
          <div>
            Rendering: SSG · ISR (60s) · SSR | Auth.js JWT | Defense-in-depth
          </div>
        </div>
      </div>
    </footer>
  );
}
