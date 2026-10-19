// الملف: site.ts
// الوظيفة: ملف إعدادات الموقع المركزي يحوي بيانات السيرة وروابط التواصل.
// المحتوى: siteConfig مع الاسم والعنوان والبريد وروابط WhatsApp/LinkedIn/GitHub والإحصائيات.
// الاعتماديات: بدون استيرادات؛ كائن ثابت يُستهلك في المكونات.
export const siteConfig = {
  name: 'Salman Al-Ansi',
  shortName: 'Salman',
  
  titleEn: 'AI Engineer, Web Developer & Mobile App Developer',
  titleAr: 'مهندس ذكاء اصطناعي، مطور مواقع ويب ومطور تطبيقات موبايل',
  taglineEn: 'I build modern web applications with Next.js,Laravel and Filament I turn ideas into real products.',
  taglineAr: 'أقوم ببناء تطبيقات ويب حديثة باستخدام Next.js و Laravel و Filament. أحوّل الأفكار إلى منتجات حقيقية وعملية.',
  email: 'salman.developer.ai@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/salman-al-ansi-93ab92397',
  githubUrl: 'https://github.com/salman-dev-ai',
  // Direct WhatsApp link as specified in guidelines
  whatsappNumber: '+769771924870',
  whatsappUrl: 'https://wa.me/769771924870?text=Hello%20Salman,%20I%20saw%20your%20portfolio',
  cvEnglishPath: '/cv/Salman_Al_Ansi_CV_EN.pdf',
  cvArabicPath: '/cv/Salman_Al_Ansi_CV_AR.pdf',
  stats: {
    projectsCount: '6+',
    coursesCount: '3+',
    yearsExperience: '2+',
    openToOpportunities: true,
  },
  learningStack: [
    'Flutter',
    'Dart',
    'n8n',
    'Yolo',
  ],
};
