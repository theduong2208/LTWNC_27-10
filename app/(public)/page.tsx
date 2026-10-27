import Link from 'next/link';
import { getDeadlines, getSubjects } from '@/lib/db';
import CountdownTimer from '@/components/CountdownTimer';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import {
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Award,
} from 'lucide-react';

// Chiến lược: SSG (Static Site Generation) - Được tạo sẵn lúc build time
export const dynamic = 'force-static';

export const metadata = {
  title: 'Trang chủ | Class Deadline Hub PTIT',
  description: 'Cổng thông tin deadline và bài tập lớp học viện PTIT. Xem deadline công khai, cập nhật tiến độ học tập.',
};

export default async function HomePage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  // Lấy 4 deadline gần nhất
  const upcomingDeadlines = deadlines.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #7f1d1d 100%)',
          color: '#ffffff',
          padding: '70px 0 60px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fecaca',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Zap size={15} style={{ color: '#f87171' }} />
              <span>Học viện Công nghệ Bưu chính Viễn thông - Lớp D23CQCC01-B</span>
              <span className="badge-strategy" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                SSG
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '18px',
                letterSpacing: '-0.5px',
              }}
            >
              Class Deadline Hub <br />
              <span style={{ color: '#f87171' }}>Quản lý & Nhắc hạn Deadline Lớp</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#cbd5e1',
                marginBottom: '32px',
                lineHeight: 1.6,
              }}
            >
              Không còn nỗi lo muộn bài tập lớn! Xem lịch nộp deadline công khai của từng môn học,
              đăng nhập để đánh dấu bài đã hoàn thành và nhận thông báo theo thời gian thực.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/deadlines" className="btn btn-primary btn-lg">
                <Calendar size={18} />
                <span>Xem tất cả {deadlines.length} Deadline</span>
              </Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                <CheckCircle size={18} />
                <span>Dashboard Sinh viên</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {deadlines.length}
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Tổng số Deadline học tập
              </p>
            </div>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {subjects.length}
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Môn học chuyên ngành
              </p>
            </div>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                60 Giây
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Tần suất tái tạo ISR
              </p>
            </div>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
                100%
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Bảo vệ Server Action & Middleware
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: 4 Môn học (Link SSG) */}
      <section id="subjects" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="badge-strategy">SSG Route</span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Các môn học đang học kỳ này</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Nhấp vào từng môn để xem chi tiết giảng viên, mô tả và danh sách deadline riêng biệt
            </p>
          </div>

          <div className="grid-cols-4">
            {subjects.map((sub) => {
              const subDeadlines = deadlines.filter((d) => d.subjectSlug === sub.slug);
              return (
                <Link
                  key={sub.slug}
                  href={`/subjects/${sub.slug}`}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${sub.color}`,
                    height: '100%',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: '#475569',
                        }}
                      >
                        {sub.code}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {sub.credits} tín chỉ
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                      {sub.name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      GV: {sub.lecturer}
                    </p>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '16px',
                      }}
                    >
                      {sub.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: sub.color,
                    }}
                  >
                    <span>{subDeadlines.length} deadline</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Deadline sắp tới (Upcoming Deadlines) */}
      <section style={{ padding: '60px 0', backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '15px',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="badge-strategy">ISR Preview</span>
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Deadline sắp đến hạn</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                Các bài tập có thời hạn gần nhất cần được ưu tiên nộp trước
              </p>
            </div>
            <Link href="/deadlines" className="btn btn-secondary">
              <span>Xem toàn bộ deadline</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cols-2">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        backgroundColor: 'var(--accent-light)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {item.subjectName}
                    </span>
                    <span
                      className={`badge ${item.priority === 'high'
                        ? 'badge-high'
                        : item.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low'
                        }`}
                    >
                      {item.priority === 'high' ? 'Ưu tiên Cao' : 'Bình thường'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                    <Link href={`/deadlines/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderTop: '1px solid var(--border)',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Hạn: {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                    <CountdownTimer dueDate={item.dueDate} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MarkCompleteButton
                      deadlineId={item.id}
                      initialCompleted={false}
                      size="sm"
                    />
                    <Link href={`/deadlines/${item.id}`} className="btn btn-outline btn-sm">
                      <span>Chi tiết</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Bảng Ma trận phân quyền trực quan */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Ma trận Phân quyền Hệ thống</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Áp dụng kiến trúc Defense-in-depth: kiểm tra tại Middleware, Server Component và mọi Server Action
            </p>
          </div>

          <div
            className="card"
            style={{
              overflowX: 'auto',
              maxWidth: '800px',
              margin: '0 auto',
              padding: 0,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.9rem' }}>Hành động</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                    guest (Khách)
                  </th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                    user (Sinh viên)
                  </th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                    admin (Lớp trưởng)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Xem deadline công khai</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Đánh dấu đã xong</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>✗</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Thêm deadline mới</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>✗</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>✗</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>Xoá deadline</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>✗</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>✗</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
