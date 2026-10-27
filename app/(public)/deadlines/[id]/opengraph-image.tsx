import { ImageResponse } from 'next/og';
import { getDeadlineById } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Class Deadline Hub PTIT - Chi tiết Deadline';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Đọc font local trực tiếp để tránh bug đường dẫn file:\\ trên môi trường Windows Node.js
function getLocalFont() {
  const fontPath = path.join(
    process.cwd(),
    'node_modules',
    'next',
    'dist',
    'compiled',
    '@vercel',
    'og',
    'noto-sans-v27-latin-regular.ttf'
  );
  if (fs.existsSync(fontPath)) {
    return fs.readFileSync(fontPath);
  }
  return null;
}

export default async function Image({ params }: { params: { id: string } }) {
  const deadline = await getDeadlineById(params.id);
  const fontBuffer = getLocalFont();

  const title = deadline?.title || 'Chi tiết Deadline PTIT';
  const subjectName = deadline?.subjectName || 'Học viện Công nghệ Bưu chính Viễn thông';
  const dueDate = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN')
    : '';
  const priority = deadline?.priority === 'high' ? 'GẤP' : 'BÌNH THƯỜNG';

  const fontsConfig: any[] = [];
  if (fontBuffer) {
    fontsConfig.push({
      name: 'Noto Sans',
      data: fontBuffer,
      style: 'normal',
      weight: 400,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #991b1b 100%)',
          color: '#ffffff',
          fontFamily: 'Noto Sans, sans-serif',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 900,
                color: '#fff',
              }}
            >
              P
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#f87171' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '16px', color: '#cbd5e1' }}>
                Học viện Công nghệ Bưu chính Viễn thông (PTIT)
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              backgroundColor: priority === 'GẤP' ? '#dc2626' : '#2563eb',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '1px',
            }}
          >
            {priority}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '30px 0' }}>
          <div
            style={{
              fontSize: '22px',
              color: '#60a5fa',
              fontWeight: 700,
            }}
          >
            MÔN HỌC: {subjectName.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: '44px',
              fontWeight: 900,
              lineHeight: 1.25,
              color: '#ffffff',
              maxHeight: '170px',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '25px',
          }}
        >
          <div style={{ fontSize: '22px', color: '#fecaca', fontWeight: 700 }}>
            HẠN NỘP BÀI: {dueDate}
          </div>
          <div style={{ fontSize: '18px', color: '#94a3b8' }}>
            portal: ptit.edu.vn | D21CQCN01-B
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontsConfig.length > 0 ? fontsConfig : undefined,
    }
  );
}
