// الملف: agent.ts
// الوظيفة: تعريف أنواع إعدادات الوكيل الذكي وتوفير إعداد افتراضي جاهز
// المحتوى: واجهات AgentFaq و AgentConfig و ChatMessage والثابت defaultAgentConfig
// الاعتماديات: ملف أنواع مستقل بلا استيرادات خارجية
export interface AgentFaq {
  id: string;
  question: string;
  answer: string;
}

export interface AgentConfig {
  agentName: string;
  engineerName: string;
  engineerTitle: string;
  bio: string;
  yearsExperience: string;
  specialties: string;
  availability: string;
  ratesNote: string;
  customKnowledge: string;
  strictMode: boolean;
  welcomeMessageAr: string;
  welcomeMessageEn: string;
  faqs: AgentFaq[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const defaultAgentConfig: AgentConfig = {
  agentName: '  Salman AI Agent',
  engineerName: 'Salman Al-Ansi (سلمان الانسي)',
  engineerTitle: 'AI Engineer, Web Developer & Mobile App Developer',
  bio: 'مهندس ذكاء اصطناعي ومطور تطبيقات ويب وموبايل، متخصص في بناء الحلول الذكية والتطبيقات المتكاملة التي تجمع بين قوة الذكاء الاصطناعي وسهولة الاستخدام.',
  yearsExperience: 'خبرة عملية متقدمة في بناء الأنظمة المعقدة وإدارتها سحابياً لأكثر من عامين احترافيين.',
  specialties: 'Artificial Intelligence, Next.js, React, React Native, Flutter, TypeScript, Node.js, Python, TensorFlow, PyTorch',
  availability: 'متاح للمشاريع المبتكرة في الذكاء الاصطناعي، تطوير تطبيقات الويب والموبايل، والاستشارات التقنية.',
  ratesNote: 'يتم تحديد التكلفة بناءً على تعقيد المشروع ونوع التقنيات المستخدمة (ذكاء اصطناعي، ويب، أو موبايل). يرجى التواصل للحصول على عرض سعر مخصص.',
  customKnowledge: `- التخصصات الأساسية: تطوير نماذج الذكاء الاصطناعي، بناء تطبيقات الويب الحديثة بـ Next.js، وتطوير تطبيقات الموبايل الهجينة والأصلية.
- رؤية العمل: دمج تقنيات الذكاء الاصطناعي في تطبيقات الويب والموبايل لتقديم تجربة مستخدم ذكية وفريدة.
- معايير الجودة: التركيز على الأداء، قابلية التوسع، وأمن البيانات في كافة الحلول البرمجية.
- قنوات التواصل المباشرة:
  * واتساب: https://wa.me/769771924870
  * البريد الإلكتروني: salman.developer.ai@gmail.com
  * لينكد إن: https://www.linkedin.com/in/salman-al-ansi-93ab92397
  * جيت هاب: https://github.com/salman-dev-ai`,
  strictMode: true,
  welcomeMessageAr: 'مرحباً بك! 👋 أنا الوكيل الذكي المعتمد للمهندس سلمان الانسي. يسعدني إجابتك على كافة استفساراتك حول خبرات سلمان، ومواصفات مشاريعه، وتقنياته، وسياسة العمل والتواصل معه.',
  welcomeMessageEn: 'Welcome! 👋 I am Salman Al-Ansi\'s official AI representative. I am here to assist you with verified details about Salman\'s skills, projects, DevOps expertise, and collaboration opportunities.',
  faqs: [
    {
      id: 'faq-1',
      question: 'ما هي التقنيات الأساسية التي يعتمد عليها سلمان؟',
      answer: 'يعتمد سلمان بشكل رئيسي على Next.js 15 و React 19 و TypeScript و Tailwind CSS للواجهات، و Node.js/Laravel/MySQL للخلفيات، بالإضافة إلى Docker و Linux و CI/CD لأتمتة البنية التحتية ونشر التطبيقات.',
    },
    {
      id: 'faq-2',
      question: 'كيف يمكن التعاقد وبدء مشروع مع سلمان؟',
      answer: 'يمكنك إرسال تفاصيل المشروع مباشرة عبر واتساب أو البريد الإلكتروني (salman.developer.ai@gmail.com) لتحديد نطاق العمل والجدول الزمني وعرض السعر المناسب.',
    },
    {
      id: 'faq-3',
      question: 'هل يقدم سلمان خدمات الاستشارات أو ضبط خوادم DevOps؟',
      answer: 'نعم، يقدم سلمان استشارات هندسية متخصصة وإعداد حاويات Docker وخوادم Linux وأنابيب النشر المؤتمتة لضمان استقرار التطبيقات وسرعة إطلاقها.',
    },
  ],
};
