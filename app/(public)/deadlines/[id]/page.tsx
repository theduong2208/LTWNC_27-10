import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDeadlineById, getDeadlines, getSubjectBySlug } from '@/lib/db';
import CountdownTimer from '@/components/CountdownTimer';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Share2,
  Tag,
  AlertTriangle,
  Award,
} from 'lucide-react';

// Cho phép render on-demand cho các deadline mới tạo sau này
export const dynamicParams = true;

// Pre-render các deadline hiện có lúc build time
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((item) => ({
    id: item.id,
  }));
}

// 13. Metadata động cho /deadlines/[id], kèm ảnh chia sẻ sinh động
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const deadline = await getDeadlineById(params.id);

  if (!deadline) {
    return {
      title: 'Không tìm thấy Deadline',
      description: 'Deadline không tồn tại trên hệ thống.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/deadlines/${deadline.id}`;
  const dueDateFormatted = new Date(deadline.dueDate).toLocaleDateString('vi-VN');

  return {
    title: `${deadline.title} (${deadline.subjectName}) | Hạn: ${dueDateFormatted}`,
    description: `${deadline.description.slice(0, 160)}... Môn học: ${deadline.subjectName}, hạn chót: ${dueDateFormatted}.`,
    keywords: [
      deadline.subjectName,
      'deadline ptit',
      'nộp bài tập',
      deadline.title,
    ],
    openGraph: {
      title: `${deadline.title} - ${deadline.subjectName}`,
      description: `Hạn nộp: ${dueDateFormatted} | ${deadline.description.slice(0, 150)}...`,
      url: pageUrl,
      siteName: 'Class Deadline Hub PTIT',
      locale: 'vi_VN',
      type: 'article',
      images: [
        {
          url: `${siteUrl}/api/og/${deadline.id}`,
          width: 1200,
          height: 630,
          alt: deadline.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: deadline.title,
      description: `Hạn nộp: ${dueDateFormatted} - ${deadline.subjectName}`,
      images: [`${siteUrl}/api/og/${deadline.id}`],
    },
  };
}

export default async function DeadlineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const deadline = await getDeadlineById(params.id);

  // Yêu cầu 2: Id không tồn tại thì hiện trang 404 của dự án
  if (!deadline) {
    notFound();
  }

  const [subject, session] = await Promise.all([
    getSubjectBySlug(deadline.subjectSlug),
    getServerSession(authOptions),
  ]);

  const isCompleted = session?.user?.id
    ? deadline.completedUsers.includes(session.user.id)
    : false;

  const dueDateObj = new Date(deadline.dueDate);
  const formattedDueDate = dueDateObj.toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 15. Structured data (JSON-LD) kiểu BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Danh sách Deadline',
        item: `${siteUrl}/deadlines`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.subjectName,
        item: `${siteUrl}/subjects/${deadline.subjectSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: deadline.title,
        item: `${siteUrl}/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="container-narrow" style={{ padding: '40px 20px 80px 20px' }}>
      {/* 15. Chèn JSON-LD structured data vào trang */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Navigation Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-muted)' }}>
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/deadlines" style={{ color: 'var(--text-muted)' }}>
          Deadlines
        </Link>
        <span>/</span>
        <Link
          href={`/subjects/${deadline.subjectSlug}`}
          style={{ color: 'var(--accent)', fontWeight: 600 }}
        >
          {deadline.subjectName}
        </Link>
      </nav>

      {/* Main Detail Card */}
      <article
        className="card"
        style={{
          padding: '36px',
          backgroundColor: '#ffffff',
          borderTop:
            deadline.priority === 'high'
              ? '6px solid var(--danger)'
              : '6px solid var(--primary)',
        }}
      >
        {/* Meta badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className={`badge ${
                deadline.priority === 'high'
                  ? 'badge-high'
                  : deadline.priority === 'medium'
                  ? 'badge-medium'
                  : 'badge-low'
              }`}
            >
              {deadline.priority === 'high'
                ? 'Ưu tiên Cao (Gấp)'
                : deadline.priority === 'medium'
                ? 'Mức độ Trung bình'
                : 'Mức độ Thấp'}
            </span>

            <span className="badge-strategy">ISR on-demand</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: '#f1f5f9',
                color: '#334155',
                padding: '3px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Thang điểm: {deadline.maxScore}đ
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            lineHeight: 1.3,
            color: 'var(--text-main)',
            marginBottom: '20px',
          }}
        >
          {deadline.title}
        </h1>

        {/* Time banner */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginBottom: '4px',
              }}
            >
              <Calendar size={16} />
              <span>Thời hạn chót nộp bài:</span>
            </div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
              {formattedDueDate}
            </strong>
          </div>

          <div>
            <CountdownTimer dueDate={deadline.dueDate} />
          </div>
        </div>

        {/* Action Button: Mark complete */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            padding: '16px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MarkCompleteButton
              deadlineId={deadline.id}
              initialCompleted={isCompleted}
              size="md"
            />
            {session?.user && isCompleted && (
              <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                Bạn đã hoàn thành bài tập này!
              </span>
            )}
          </div>

          {deadline.submissionLink && (
            <a
              href={deadline.submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={16} />
              <span>Mở cổng nộp bài tập</span>
            </a>
          )}
        </div>

        {/* Detailed content */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            Yêu cầu & Nội dung chi tiết
          </h2>
          <div
            style={{
              fontSize: '1rem',
              color: '#334155',
              lineHeight: 1.7,
              backgroundColor: '#fff',
              padding: '18px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              whiteSpace: 'pre-line',
            }}
          >
            {deadline.description}
          </div>
        </div>

        {/* Subject Information section */}
        {subject && (
          <div
            style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '32px',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
              Thông tin học phần: {subject.name} ({subject.code})
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Giảng viên: <strong>{subject.lecturer}</strong> • Số tín chỉ: <strong>{subject.credits}</strong>
            </p>
            <Link
              href={`/subjects/${subject.slug}`}
              style={{
                fontSize: '0.88rem',
                color: 'var(--accent)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Xem tất cả bài tập môn {subject.name} →
            </Link>
          </div>
        )}

        {/* Social Share Preview Note */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={15} />
            <span>Link chia sẻ có sẵn ảnh xem trước OpenGraph sinh động</span>
          </div>
          <Link
            href="/deadlines"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-main)',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            <span>Quay lại danh sách</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
