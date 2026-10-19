// الملف: technologies.ts
// الوظيفة: بيانات التقنيات التي يعمل بها المهندس لعرض المهارات.
// المحتوى: واجهة TechItem ومصفوفة techStackData مصنّفة إلى Frontend و Backend و DevOps.
// الاعتماديات: بدون استيرادات؛ تعريف الواجهة محلي.
export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps & Tools';
  descriptionEn: string;
  descriptionAr: string;
}

export const techStackData: TechItem[] = [
  // Frontend
  {
    name: 'Next.js',
    category: 'Frontend',
    descriptionEn: 'React framework for production SSR, SSG, and App Router.',
    descriptionAr: 'إطار عمل React المتقدم للعرض من الخادم والتوليد الثابت.',
  },
  {
    name: 'React',
    category: 'Frontend',
    descriptionEn: 'Component-based library for dynamic client interfaces.',
    descriptionAr: 'مكتبة الواجهات البرمجية التفاعلية المعتمدة على المكونات.',
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    descriptionEn: 'Strongly typed JavaScript providing enterprise safety.',
    descriptionAr: 'جافاسكريبت المكتوبة بالأنواع الصارمة لبرمجيات متينة.',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    descriptionEn: 'Utility-first modern styling system.',
    descriptionAr: 'نظام تنسيق مبني على الأدوات السريعة والمرنة.',
  },

  // Backend
  {
    name: 'Laravel',
    category: 'Backend',
    descriptionEn: 'Robust PHP web framework with elegant syntax.',
    descriptionAr: 'إطار عمل ويب قوي ومرن بلغة PHP.',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    descriptionEn: 'Asynchronous event-driven JavaScript runtime.',
    descriptionAr: 'بيئة تشغيل جافاسكريبت غير متزامنة وسريعة.',
  },
  {
    name: 'Express',
    category: 'Backend',
    descriptionEn: 'Minimalist and flexible web framework for Node.',
    descriptionAr: 'إطار عمل سريع ومرن لبناء الواجهات الخلفية والـ APIs.',
  },
  {
    name: 'MySQL',
    category: 'Backend',
    descriptionEn: 'Relational database management and query optimization.',
    descriptionAr: 'نظام إدارة قواعد البيانات العلائقية الموثوق.',
  },

  // DevOps & Tools
  {
    name: 'Docker',
    category: 'DevOps & Tools',
    descriptionEn: 'Containerization for consistent environments.',
    descriptionAr: 'تقنية الحاويات لعزل البيئات وتوحيدها عبر مراحل النشر.',
  },
  {
    name: 'Git',
    category: 'DevOps & Tools',
    descriptionEn: 'Distributed version control and branching workflows.',
    descriptionAr: 'نظام التحكم في الإصدارات وإدارة فروع العمل البرمجية.',
  },
  {
    name: 'Linux',
    category: 'DevOps & Tools',
    descriptionEn: 'Server management, shell automation, and POSIX tools.',
    descriptionAr: 'إدارة الخوادم، أتمتة نصوص Bash والتحكم بالأجهزة.',
  },
  {
    name: 'GitHub',
    category: 'DevOps & Tools',
    descriptionEn: 'Collaborative code review, Actions CI/CD pipelines.',
    descriptionAr: 'منصة التعاون البرمجي وأنابيب الأتمتة GitHub Actions.',
  },
];
