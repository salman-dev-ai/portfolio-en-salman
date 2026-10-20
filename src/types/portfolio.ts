// الملف: portfolio.ts
// الوظيفة: تعريف الأنواع الأساسية لبيانات المشاريع والتقنيات والشهادات
// المحتوى: Project و TechnologyItem و Testimonial
// الاعتماديات: ملف أنواع مستقل بلا استيرادات خارجية
export interface Project {
  id: string;
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  shortDescription: {
    en: string;
    ar: string;
  };
  fullDescription: {
    en: string;
    ar: string;
  };
  thumbnail: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  highlights: {
    en: string[];
    ar: string[];
  };
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps & Tools';
  iconKey?: string;
}

export interface Testimonial {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  role: {
    en: string;
    ar: string;
  };
  quote: {
    en: string;
    ar: string;
  };
  avatar: string;
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  thumbnail: string;
  difficulty: CourseDifficulty;
  lessonsCount: number;
  durationHours: number;
  shortDescription: {
    en: string;
    ar: string;
  };
  fullDescription: {
    en: string;
    ar: string;
  };
  syllabus: {
    en: string[];
    ar: string[];
  };
  featured?: boolean;
}
