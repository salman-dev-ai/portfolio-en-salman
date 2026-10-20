// الملف: courses.ts
// الوظيفة: بيانات الدورات التعليمية المستخدمة لعرض قسم الدورات.
// المحتوى: coursesData مصفوفة من 5 دورات مع العنوان والتصنيف والوصف والمخطط.
// الاعتماديات: نوع Course من '../types/portfolio.ts'.
import { Course } from '../types/portfolio.ts';

export const coursesData: Course[] = [
  {
    id: 'course-1',
    slug: 'nextjs-mastery',
    title: {
      en: 'Next.js Mastery',
      ar: 'احتراف Next.js الشامل',
    },
    category: {
      en: 'Frontend',
      ar: 'تطوير الواجهات',
    },
    difficulty: 'Beginner',
    lessonsCount: 12,
    durationHours: 6,
    shortDescription: {
      en: 'Learn Next.js from scratch with real projects.',
      ar: 'تعلم Next.js من البداية عبر مشاريع عملية حقيقية.',
    },
    fullDescription: {
      en: 'Master modern full-stack React development with Next.js App Router. Learn Server Components, client boundary patterns, static site generation, incremental regeneration, and seamless production deployments.',
      ar: 'أتقن تطوير الويب الحديث بواسطة مسار Next.js App Router، وتعرّف على مكونات الخادم ومكونات العميل والتوليد الثابت للصفحات وتكتيكات الأداء العالي.',
    },
    thumbnail: '/assets/images/course_react_1792383957806.jpg',
    featured: true,
    syllabus: {
      en: [
        'Module 1: Foundations of Next.js & App Router structure',
        'Module 2: Server Components vs Client Components in depth',
        'Module 3: Dynamic routing, nested layouts, and loading states',
        'Module 4: Data fetching strategies and cache management',
        'Module 5: Building and deploying a production-ready application',
      ],
      ar: [
        'الوحدة 1: أساسيات Next.js وهيكلية App Router',
        'الوحدة 2: مكونات الخادم مقابل مكونات العميل بتعمق',
        'الوحدة 3: التوجيه الديناميكي والمخططات المتداخلة وحالات التحميل',
        'الوحدة 4: استراتيجيات جلب البيانات وإدارة الكاش',
        'الوحدة 5: بناء تطبيق كامل ونشره للإنتاج',
      ],
    },
  },
  {
    id: 'course-2',
    slug: 'react-advanced',
    title: {
      en: 'React Advanced',
      ar: 'المفاهيم المتقدمة في React',
    },
    category: {
      en: 'Frontend',
      ar: 'تطوير الواجهات',
    },
    difficulty: 'Intermediate',
    lessonsCount: 8,
    durationHours: 4,
    shortDescription: {
      en: 'Master advanced React concepts and hooks.',
      ar: 'احترف مفاهيم React المتقدمة واستخدام الخطافات (Hooks).',
    },
    fullDescription: {
      en: 'Deep-dive into React internals, custom hooks architecture, reconciliation mechanics, render optimization, Context patterns without performance bottlenecks, and state machines.',
      ar: 'تعمق في البنية الداخلية لـ React، وهندسة الخطافات المخصصة، وآليات إعادة التصيير، وتحسين الأداء، وتفادي مشاكل إعادة التصيير المتكررة.',
    },
    thumbnail: '/assets/images/course_react_1792383957806.jpg',
    featured: true,
    syllabus: {
      en: [
        'Module 1: Fiber architecture and reconciliation lifecycle',
        'Module 2: Designing bulletproof custom hooks',
        'Module 3: Profiling and eliminating re-render waste',
        'Module 4: Complex state machines and reducer composition',
      ],
      ar: [
        'الوحدة 1: معمارية Fiber ودورة حياة تحديث العناصر',
        'الوحدة 2: تصميم خطافات مخصصة وقابلة لإعادة الاستخدام',
        'الوحدة 3: قياس الأداء وتفادي استهلاك موارد المتصفح',
        'الوحدة 4: إدارة الحالات المعقدة بواسطة Reducers',
      ],
    },
  },
  {
    id: 'course-3',
    slug: 'typescript-essentials',
    title: {
      en: 'TypeScript Essentials',
      ar: 'أساسيات تايب سكريبت للمطورين',
    },
    category: {
      en: 'Languages',
      ar: 'لغات البرمجة',
    },
    difficulty: 'Beginner',
    lessonsCount: 10,
    durationHours: 5,
    shortDescription: {
      en: 'Build type-safe applications with TypeScript.',
      ar: 'ابنِ تطبيقات متينة وخالية من أخطاء الأنواع مع TypeScript.',
    },
    fullDescription: {
      en: 'A foundational yet pragmatic course teaching modern TypeScript: strict type safety, generics, union discriminating patterns, utility types, and seamless React integration.',
      ar: 'دورة تطبيقية وعملية لتعلم TypeScript الحديثة: الأنواع الصارمة، Generics، وتنسيق النماذج، والدمج السلس مع مشاريع React والواجهات الخلفية.',
    },
    thumbnail: '/assets/images/course_typescript_1792383958190.jpg',
    featured: true,
    syllabus: {
      en: [
        'Module 1: The TypeScript mental model and primitive types',
        'Module 2: Interfaces, type aliases, and discriminated unions',
        'Module 3: Generics and advanced utility types',
        'Module 4: Typing React components, hooks, and events safely',
      ],
      ar: [
        'الوحدة 1: النموذج الذهني لـ TypeScript والأنواع الأولية',
        'الوحدة 2: الواجهات Interfaces وأنواع الاتحادات Union Types',
        'الوحدة 3: الأنواع المعممة Generics والأدوات المساعدة',
        'الوحدة 4: كتابة مكونات React والأحداث بأنواع آمنة ومحكمة',
      ],
    },
  },
  {
    id: 'course-4',
    slug: 'docker-for-developers',
    title: {
      en: 'Docker & Containerization',
      ar: 'أساسيات Docker وإدارة الحاويات',
    },
    category: {
      en: 'DevOps',
      ar: 'ديف أوبس',
    },
    difficulty: 'Intermediate',
    lessonsCount: 14,
    durationHours: 7,
    shortDescription: {
      en: 'Practical guide to packaging and deploying with Docker.',
      ar: 'دليل عملي لتغليف التطبيقات ونشرها بكفاءة باستخدام Docker.',
    },
    fullDescription: {
      en: 'Containerize multi-service applications with confidence. Covers Dockerfile optimization, multi-stage builds, Docker Compose, volume persistence, and container networking.',
      ar: 'احترف تغليف التطبيقات متعددة الخدمات بثقة. يغطي التحسين المتقدم لملفات Dockerfile، والبناء متعدد المراحل، وDocker Compose والشبكات الافتراضية.',
    },
    thumbnail: '/assets/images/hero_workspace_sunset_1792383939734.jpg',
    featured: false,
    syllabus: {
      en: [
        'Module 1: Container virtualization concepts',
        'Module 2: Writing minimal multi-stage Dockerfiles',
        'Module 3: Orchestrating development stacks with Compose',
        'Module 4: Security best practices and least-privilege users',
      ],
      ar: [
        'الوحدة 1: مفاهيم الحاويات والبيئات الافتراضية',
        'الوحدة 2: كتابة ملفات Dockerfile مصغرة ومتعددة المراحل',
        'الوحدة 3: تنظيم بيئات التطوير بواسطة Docker Compose',
        'الوحدة 4: أفضل ممارسات الأمان وإدارة الصلاحيات',
      ],
    },
  },
  {
    id: 'course-5',
    slug: 'system-design-architecture',
    title: {
      en: 'System Design & Scalable Architecture',
      ar: 'تصميم النظم والمعمارية القابلة للتوسع',
    },
    category: {
      en: 'Architecture',
      ar: 'هندسة النظم',
    },
    difficulty: 'Advanced',
    lessonsCount: 16,
    durationHours: 9,
    shortDescription: {
      en: 'Principles of resilient, high-throughput distributed systems.',
      ar: 'مبادئ وأسس تصميم النظم الموزعة عالية المرونة والأداء.',
    },
    fullDescription: {
      en: 'Learn how to architect applications for massive scalability. Covers caching layers, database sharding and replication, event-driven queues, load balancing, and fault tolerance.',
      ar: 'تعلم كيفية هندسة التطبيقات لتتحمل التوسع الهائل، بدءاً من طبقات التخزين المؤقت، وتقسيم قواعد البيانات، والرسائل غير المتزامنة، وتوزيع الأحمال.',
    },
    thumbnail: '/assets/images/about_developer_work_1792383940477.jpg',
    featured: false,
    syllabus: {
      en: [
        'Module 1: Vertical vs horizontal scaling tradeoffs',
        'Module 2: Caching topologies with Redis',
        'Module 3: Asynchronous pipelines with message brokers',
        'Module 4: Reliability engineering and graceful degradation',
      ],
      ar: [
        'الوحدة 1: المفاضلة بين التوسع الرأسي والأفقي',
        'الوحدة 2: طبقات التخزين المؤقت واستراتيجياتها',
        'الوحدة 3: مسارات العمل غير المتزامنة وموزعات الرسائل',
        'الوحدة 4: موثوقية الأنظمة والتعامل مع الأعطال بمرونة',
      ],
    },
  },
];
