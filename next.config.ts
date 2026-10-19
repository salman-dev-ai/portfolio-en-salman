// الملف: next.config.ts
// الوظيفة: إعدادات Next.js الأساسية للمشروع.
// المحتوى: تفعيل cacheComponents و partialPrefetching، وقاعدة Turbopack لمعالجة ملفات CSS.
// الاعتماديات: @tailwindcss/turbopack لتشغيل Tailwind v4 داخل Turbopack.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
