import { NextRequest, NextResponse } from 'next/server';
import { getDeadlineById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deadline = await getDeadlineById(params.id);

  const title = deadline?.title || 'Chi tiết Deadline PTIT';
  const subjectName = deadline?.subjectName || 'Học viện Công nghệ Bưu chính Viễn thông';
  const dueDate = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN')
    : '';
  const priority = deadline?.priority === 'high' ? 'GẤP' : 'BÌNH THƯỜNG';
  const priorityColor = deadline?.priority === 'high' ? '#dc2626' : '#2563eb';

  // Thoát ký tự XML an toàn
  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const safeTitle = escapeXml(title);
  const safeSubject = escapeXml(subjectName);
  const safeDate = escapeXml(dueDate);

  // Cắt dòng nếu tiêu đề dài
  let line1 = safeTitle;
  let line2 = '';
  if (safeTitle.length > 40) {
    const spaceIndex = safeTitle.lastIndexOf(' ', 40);
    const splitAt = spaceIndex > 20 ? spaceIndex : 40;
    line1 = safeTitle.substring(0, splitAt);
    line2 = safeTitle.substring(splitAt).trim();
    if (line2.length > 45) {
      line2 = line2.substring(0, 42) + '...';
    }
  }

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Grid decoration lines -->
  <line x1="60" y1="140" x2="1140" y2="140" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
  <line x1="60" y1="510" x2="1140" y2="510" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />

  <!-- Logo and App Name -->
  <g transform="translate(60, 50)">
    <rect width="60" height="60" rx="14" fill="#dc2626" />
    <text x="30" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">P</text>
    <text x="80" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#f87171">Class Deadline Hub</text>
    <text x="80" y="54" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#94a3b8">Học viện Công nghệ Bưu chính Viễn thông (PTIT)</text>
  </g>

  <!-- Priority Badge -->
  <g transform="translate(1000, 60)">
    <rect width="140" height="42" rx="21" fill="${priorityColor}" />
    <text x="70" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">${priority}</text>
  </g>

  <!-- Subject Name -->
  <g transform="translate(60, 200)">
    <rect width="320" height="34" rx="8" fill="#1e3a8a" fill-opacity="0.6" />
    <text x="16" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#60a5fa">MÔN: ${safeSubject.toUpperCase()}</text>
  </g>

  <!-- Deadline Title -->
  <g transform="translate(60, 290)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" fill="#ffffff">${line1}</text>
    ${line2 ? `<text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" fill="#ffffff">${line2}</text>` : ''}
  </g>

  <!-- Footer meta -->
  <g transform="translate(60, 565)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#fecaca">HẠN CHÓT NỘP BÀI: ${safeDate}</text>
    <text x="1080" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" fill="#94a3b8" text-anchor="end">portal: ptit.edu.vn | D21CQCN01-B</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}
