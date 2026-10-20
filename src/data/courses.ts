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
