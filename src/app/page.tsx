// الملف: page.tsx
// الوظيفة: الصفحة الرئيسية لتطبيق Next.js التي تعرض التطبيق العميل.
// المحتوى: مكوّن Page الافتراضي الذي يُرجع ClientApp.
// الاعتماديات: استيراد ClientApp من ./client.
import { ClientApp } from './client';

export default function Page() {
  return <ClientApp />;
}
