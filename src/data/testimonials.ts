// الملف: testimonials.ts
// الوظيفة: بيانات شهادات العملاء المستخدمة لعرض قسم التوصيات.
// المحتوى: testimonialsData مصفوفة من 3 شهادات مع الاسم والدور والاقتباس والصورة.
// الاعتماديات: نوع Testimonial من '../types/portfolio.ts'.
import { Testimonial } from '../types/portfolio.ts';

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: {
      en: 'Ahmed Ali',
      ar: 'أحمد علي',
    },
    role: {
      en: 'Project Manager at Tech Company',
      ar: 'مدير مشاريع بشركة تقنية',
    },
    quote: {
      en: 'Salman is a talented developer with strong problem-solving skills. He delivers clean, maintainable code and is a great team player.',
      ar: 'سلمان مطور موهوب يمتلك مهارات قوية في حل المشكلات التقنية. يسلّم كوداً نظيفاً وقابلاً للصيانة وموثوقاً، وهو عنصر فاعل في روح الفريق.',
    },
    avatar: '/assets/images/testimonial_ahmed_1792383956457.jpg',
  },
  {
    id: 'test-2',
    name: {
      en: 'Tariq Mansoor',
      ar: 'طارق منصور',
    },
    role: {
      en: 'Lead DevOps Architect',
      ar: 'كبير مهندسي DevOps',
    },
    quote: {
      en: 'Working with Salman on our deployment pipeline was seamless. His attention to container security and zero-downtime releases saved us countless hours.',
      ar: 'كان العمل مع سلمان على أتمتة أنابيب النشر تجربة ممتازة، حيث وفّر تركيزه على أمان الحاويات وسرعة النشر الكثير من الجهد والوقت لفريقنا.',
    },
    avatar: '/assets/images/about_developer_work_1792383940477.jpg',
  },
  {
    id: 'test-3',
    name: {
      en: 'Sara Al-Khatib',
      ar: 'سارة الخطيب',
    },
    role: {
      en: 'Senior Frontend Engineer',
      ar: 'مهندسة واجهات أمامية أولى',
    },
    quote: {
      en: 'Salman’s mastery of modern React and Next.js translates into lightning-fast interfaces. He approaches every feature with thoughtful UX and modular code.',
      ar: 'تمكن سلمان من أدوات React و Next.js الحديثة يثمر دائماً عن واجهات فائقة السرعة، ويتعامل مع كل ميزة باهتمام كبير بتجربة المستخدم وهندسة الكود.',
    },
    avatar: '/assets/images/testimonial_ahmed_1792383956457.jpg',
  },
];
