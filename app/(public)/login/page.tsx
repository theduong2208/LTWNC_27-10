'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Key, Mail, Shield, User, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoadingType, setQuickLoadingType] = useState<'admin' | 'user' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
        setLoading(false);
      } else {
        // Chuyển trang thực tế bằng window.location để đồng bộ session cookie hoàn toàn
        const dest = email.trim() === 'admin@ptit.edu.vn' && callbackUrl === '/dashboard'
          ? '/admin'
          : (callbackUrl || '/dashboard');
        window.location.href = dest;
      }
    } catch (err) {
      setError('Đã xảy ra sự cố trong quá trình đăng nhập. Thử lại sau.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string, type: 'admin' | 'user') => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    setLoading(true);
    setQuickLoadingType(type);

    try {
      // Nếu là admin và không có callback cụ thể khác, hướng tới /admin
      const targetDestination = type === 'admin'
        ? (callbackUrl !== '/dashboard' ? callbackUrl : '/admin')
        : (callbackUrl || '/dashboard');

      const res = await signIn('credentials', {
        redirect: false,
        email: quickEmail,
        password: quickPass,
        callbackUrl: targetDestination,
      });

      if (res?.error) {
        setError('Đăng nhập thất bại: ' + res.error);
        setLoading(false);
        setQuickLoadingType(null);
      } else {
        // Điều hướng trực tiếp bằng window.location để browser nạp phiên đăng nhập mới nhất
        window.location.href = targetDestination;
      }
    } catch (err) {
      setError('Đã xảy ra sự cố trong quá trình đăng nhập.');
      setLoading(false);
      setQuickLoadingType(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 30px',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={14} />
          <span>Về Trang chủ</span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
            }}
          >
            <LogIn size={26} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
            Đăng nhập Hệ thống
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Class Deadline Hub - Cổng deadline lớp PTIT
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Địa chỉ Email PTIT
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                required
                className="form-input"
                placeholder="vd: admin@ptit.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Key
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading && !quickLoadingType ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang xử lý đăng nhập...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Đăng nhập vào Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Quick login buttons */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '12px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Bấm chọn để đăng nhập nhanh
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@ptit.edu.vn', 'admin123', 'admin')}
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderLeft: '4px solid #dc2626',
                backgroundColor: quickLoadingType === 'admin' ? '#fee2e2' : '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {quickLoadingType === 'admin' ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: '#dc2626' }} />
                ) : (
                  <Shield size={18} style={{ color: '#dc2626' }} />
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    {quickLoadingType === 'admin' ? 'Đang chuyển đến Bảng Quản trị...' : 'Lớp trưởng (Admin)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    admin@ptit.edu.vn • admin123
                  </div>
                </div>
              </div>
              <span className="badge badge-role-admin" style={{ fontSize: '0.68rem' }}>
                Admin
              </span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('sv@ptit.edu.vn', 'sv123456', 'user')}
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderLeft: '4px solid #2563eb',
                backgroundColor: quickLoadingType === 'user' ? '#dbeafe' : '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {quickLoadingType === 'user' ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: '#2563eb' }} />
                ) : (
                  <User size={18} style={{ color: '#2563eb' }} />
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    {quickLoadingType === 'user' ? 'Đang chuyển đến Dashboard...' : 'Sinh viên (User)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    sv@ptit.edu.vn • sv123456
                  </div>
                </div>
              </div>
              <span className="badge badge-role-user" style={{ fontSize: '0.68rem' }}>
                Sinh viên
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
