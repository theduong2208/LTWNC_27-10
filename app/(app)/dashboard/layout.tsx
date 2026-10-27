import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
      {/* 4. Sidebar lồng nhau */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
