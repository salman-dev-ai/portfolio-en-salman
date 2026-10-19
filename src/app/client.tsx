// الملف: client.tsx
// الوظيفة: غلاف عميل لتحميل مكوّن App ديناميكياً دون عرض مسبق.
// المحتوى: ClientApp يستخدم next/dynamic مع ssr:false لتجنب عدم تطابق الـ hydration.
// الاعتماديات: next/dynamic و App من '../App'.
'use client';

import dynamic from 'next/dynamic';

// The portfolio manages its own views through window.location.hash and browser
// APIs, so prerendering is disabled from the App component down to match the
// original client-only behavior and avoid hydration mismatches.
const App = dynamic(() => import('../App'), { ssr: false });

export function ClientApp() {
  return <App />;
}
