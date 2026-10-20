import { Course } from '../types/portfolio.ts';

export type UpcomingCourse = {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  badge: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  accent: string;
};

export const upcomingCourses: UpcomingCourse[] = [
  {
    id: 'python',
    title: {
      en: 'Python Course',
      ar: 'دورة بايثون',
    },
    badge: {
      en: 'In Progress',
      ar: 'قيد العمل',
    },
    description: {
      en: 'We are currently preparing a practical Python course for beginners and intermediate developers.',
      ar: 'نحن الآن نعمل على دورة عملية في بايثون للمبتدئين والمطورين المتوسطين.',
    },
    accent: 'from-[#FF641C] to-[#F59E0B]',
  },
  {
    id: 'ai',
    title: {
      en: 'AI Course',
      ar: 'دورة الذكاء الاصطناعي',
    },
    badge: {
      en: 'Coming Soon',
      ar: 'قريباً',
    },
    description: {
      en: 'A future course focused on AI foundations, practical tools, and real-world applications.',
      ar: 'دورة مستقبلية تركز على أساسيات الذكاء الاصطناعي والأدوات العملية وتطبيقاتها الواقعية.',
    },
    accent: 'from-[#3B82F6] to-[#8B5CF6]',
  },
  {
    id: 'automation',
    title: {
      en: 'Automation Course',
      ar: 'دورة الأتمتة',
    },
    badge: {
      en: 'Coming Soon',
      ar: 'قريباً',
    },
    description: {
      en: 'A practical track for automating tasks, workflows, and business processes using modern tools.',
      ar: 'مسار عملي لأتمتة المهام وسير العمل والعمليات باستخدام الأدوات الحديثة.',
    },
    accent: 'from-[#10B981] to-[#22C55E]',
  },
];

export const coursesData: Course[] = [
  {
    id: 'fullstack-js',
    title: {
      en: 'Full-Stack JavaScript Mastery',
      ar: 'احتراف تطوير الويب المتكامل JavaScript',
    },
    thumbnail: 'https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=modern+javascript+web+development+concept+with+code+on+screen&image_size=landscape_16_9',
    difficulty: 'Intermediate',
    lessonsCount: 42,
    durationHours: 25.5,
    featured: true,
    shortDescription: {
      en: 'Build scalable web applications using React, Node.js, and MongoDB.',
      ar: 'قم ببناء تطبيقات ويب قابلة للتوسع باستخدام React و Node.js و MongoDB.',
    },
    fullDescription: {
      en: 'A comprehensive journey through modern web development. You will learn everything from front-end basics to advanced back-end architecture.',
      ar: 'رحلة شاملة عبر تطوير الويب الحديث. ستتعلم كل شيء من أساسيات الواجهة الأمامية إلى هندسة الواجهة الخلفية المتقدمة.',
    },
    syllabus: {
      en: [
        'JavaScript Fundamentals & ES6+',
        'React Hooks and State Management',
        'Node.js & Express API Development',
        'Database Design with MongoDB',
        'Deployment and DevOps Basics',
      ],
      ar: [
        'أساسيات جافا سكريبت و ES6+',
        'React Hooks وإدارة الحالة',
        'تطوير واجهة برمجة التطبيقات Node.js & Express',
        'تصميم قواعد البيانات باستخدام MongoDB',
        'أساسيات النشر و DevOps',
      ],
    },
  },
  {
    id: 'python-data-science',
    title: {
      en: 'Python for Data Science',
      ar: 'بايثون لعلوم البيانات',
    },
    thumbnail: 'https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=data+science+visualization+python+code+concept&image_size=landscape_16_9',
    difficulty: 'Beginner',
    lessonsCount: 35,
    durationHours: 18.0,
    featured: true,
    shortDescription: {
      en: 'Learn how to analyze data and build visualizations with Python.',
      ar: 'تعلم كيفية تحليل البيانات وبناء التصورات باستخدام بايثون.',
    },
    fullDescription: {
      en: 'Master the tools used by data scientists: NumPy, Pandas, and Matplotlib. Perfect for those starting their data journey.',
      ar: 'أتقن الأدوات التي يستخدمها علماء البيانات: NumPy و Pandas و Matplotlib. مثالية لأولئك الذين يبدأون رحلتهم في البيانات.',
    },
    syllabus: {
      en: [
        'Python Basics for Data Science',
        'Working with NumPy Arrays',
        'Data Manipulation with Pandas',
        'Data Visualization with Matplotlib',
        'Intro to Machine Learning',
      ],
      ar: [
        'أساسيات بايثون لعلوم البيانات',
        'العمل مع مصفوفات NumPy',
        'معالجة البيانات باستخدام Pandas',
        'تصور البيانات باستخدام Matplotlib',
        'مقدمة في التعلم الآلي',
      ],
    },
  },
  {
    id: 'advanced-cloud-arch',
    title: {
      en: 'Advanced Cloud Architecture',
      ar: 'هندسة السحابة المتقدمة',
    },
    thumbnail: 'https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=cloud+computing+architecture+infrastructure+as+code&image_size=landscape_16_9',
    difficulty: 'Advanced',
    lessonsCount: 28,
    durationHours: 22.0,
    featured: true,
    shortDescription: {
      en: 'Design and deploy resilient cloud infrastructures on AWS.',
      ar: 'تصميم ونشر بنى تحتية سحابية مرنة على AWS.',
    },
    fullDescription: {
      en: 'Deep dive into cloud-native design patterns, serverless architecture, and high-availability systems.',
      ar: 'تعمق في أنماط التصميم الأصلية للسحابة، والهندسة بدون خادم، والأنظمة عالية التوفر.',
    },
    syllabus: {
      en: [
        'AWS Core Services Deep Dive',
        'Serverless with AWS Lambda',
        'Microservices Architecture',
        'Security Best Practices',
        'Cost Optimization Strategies',
      ],
      ar: [
        'تعمق في خدمات AWS الأساسية',
        'الأنظمة بدون خادم مع AWS Lambda',
        'هندسة الخدمات المصغرة',
        'أفضل ممارسات الأمن',
        'استراتيجيات تحسين التكلفة',
      ],
    },
  },
];
