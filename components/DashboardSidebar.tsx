'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldAlert,
  ArrowLeft,
  User,
  GraduationCap,
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  const menuItems = [
    {
      title: 'Tổng quan tiến độ',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard' && tab === 'all',
    },
    {
      title: 'Cần làm gấp',
      href: '/dashboard?tab=pending',
      icon: Clock,
      active: pathname === '/dashboard' && tab === 'pending',
    },
    {
      title: 'Đã hoàn thành',
      href: '/dashboard?tab=completed',
      icon: CheckCircle2,
      active: pathname === '/dashboard' && tab === 'completed',
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border)',
        minHeight: 'calc(100vh - 70px)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* User Card */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isAdmin ? '#fee2e2' : '#dbeafe',
                color: isAdmin ? '#dc2626' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {session?.user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {session?.user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span
              className={isAdmin ? 'badge badge-role-admin' : 'badge badge-role-user'}
              style={{ fontSize: '0.68rem', padding: '1px 8px' }}
            >
              {isAdmin ? 'Lớp trưởng (Admin)' : 'Sinh viên'}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-light)',
              paddingLeft: '12px',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            Không gian cá nhân
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: item.active ? 700 : 500,
                    backgroundColor: item.active ? 'var(--primary-light)' : 'transparent',
                    color: item.active ? 'var(--primary)' : 'var(--text-main)',
                    borderLeft: item.active ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} style={{ color: item.active ? 'var(--primary)' : '#64748b' }} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-light)',
              paddingLeft: '12px',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            Quản trị Lớp học
          </p>

          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: pathname === '/admin' ? 700 : 500,
              backgroundColor: pathname === '/admin' ? '#fee2e2' : 'transparent',
              color: pathname === '/admin' ? '#991b1b' : '#334155',
              borderLeft: pathname === '/admin' ? '3px solid #dc2626' : '3px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldAlert size={18} style={{ color: '#dc2626' }} />
            <span>Khu vực Admin</span>
            {!isAdmin && (
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: 'auto' }}>
                Khóa
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom link: Về cổng công khai */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <Link
          href="/deadlines"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          <Calendar size={16} />
          <span>Tất cả Deadline công khai</span>
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Về Trang chủ</span>
        </Link>
      </div>
    </aside>
  );
}
