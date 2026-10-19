// الملف: projects.ts
// الوظيفة: بيانات المشاريع المستخدمة لعرض معرض الأعمال.
// المحتوى: projectsData مصفوفة من 6 مشاريع مع العنوان والتقنيات والروابط والتفاصيل.
// الاعتماديات: نوع Project من '../types/portfolio.ts'.
import { Project } from '../types/portfolio.ts';

export const projectsData: Project[] = [
  {
    id: 'proj-7',
    slug: 'faceblog-social-blogging',
    title: {
      en: 'FaceBlog — Social Blogging Platform',
      ar: 'FaceBlog — منصة التدوين الاجتماعي',
    },
    category: {
      en: 'Full-Stack',
      ar: 'تطبيق متكامل',
    },
    shortDescription: {
      en: 'A production-grade social blogging platform built with Python 3, Flask, and SQLite, with a Facebook-inspired UI and 100% test coverage.',
      ar: 'منصة تدوين اجتماعي بجودة إنتاجية مبنية بـ Python 3 و Flask و SQLite، بواجهة مستوحاة من فيسبوك وتغطية اختبارية 100%.',
    },
    fullDescription: {
      en: 'A comprehensive social blogging application built as a full-stack educational resource for mastering Flask web development. Features an Application Factory pattern with Blueprint architecture, secure session-based authentication with PBKDF2-SHA256 password hashing, full CRUD blog operations with author ownership protection, Jinja2 template inheritance, a custom Facebook-inspired UI with sticky navigation and card-based feed design, modern Python packaging with Flit, and production deployment via Waitress WSGI server. Achieves 100% automated test coverage with Pytest.',
      ar: 'تطبيق تدوين اجتماعي شامل بُني كمورد تعليمي متكامل لإتقان تطوير تطبيقات الويب بإطار Flask. يتميز بنمط مصنع التطبيقات مع هيكلة البلوبرينت، ومصادقة آمنة مبنية على الجلسات مع تجزئة كلمات المرور بخوارزمية PBKDF2-SHA256، وعمليات CRUD كاملة للمدونة مع حماية ملكية المؤلف، وتوريث قوالب Jinja2، وواجهة مستخدم مخصصة مستوحاة من فيسبوك مع شريط تنقل لاصق وتصميم بطاقات، وتغليف حديث بـ Flit، ونشر إنتاجي عبر خادم Waitress WSGI. يحقق تغطية اختبارية آلية بنسبة 100% مع Pytest.',
    },
    thumbnail: '/assets/images/project_faceblog.jpg',
    technologies: ['Python 3', 'Flask 3.0', 'SQLite', 'Pytest', 'Waitress', 'Flit'],
    githubUrl: 'https://github.com/salman-dev-ai/flask-blog',
    featured: true,
    highlights: {
      en: [
        'Application Factory pattern with modular Blueprint architecture (auth + blog)',
        'Secure session-based authentication with Werkzeug PBKDF2-SHA256 password hashing',
        'Full CRUD operations with strict author ownership protection (HTTP 403/404)',
        'Custom Facebook-inspired UI with CSS variables, sticky nav, and card-based feed',
        '100% automated test coverage with Pytest across all modules',
      ],
      ar: [
        'نمط مصنع التطبيقات مع هيكلة بلوبرينت معيارية (مصادقة + مدونة)',
        'مصادقة آمنة مبنية على الجلسات مع تجزئة كلمات المرور بـ Werkzeug PBKDF2-SHA256',
        'عمليات CRUD كاملة مع حماية صارمة لملكية المؤلف (HTTP 403/404)',
        'واجهة مستخدم مستوحاة من فيسبوك مع متغيرات CSS وشريط تنقل لاصق وتصميم بطاقات',
        'تغطية اختبارية آلية بنسبة 100% مع Pytest عبر جميع الوحدات',
      ],
    },
  },
  {
    id: 'proj-6',
    slug: 'yemeni-restaurant-platform',
    title: {
      en: 'Premium Yemeni Restaurant Platform',
      ar: 'منصة مطعم يمني فاخر',
    },
    category: {
      en: 'Backend',
      ar: 'الواجهة الخلفية',
    },
    shortDescription: {
      en: 'A production-grade Laravel 12 core for a premium Yemeni restaurant, with multilingual menus, reservations, and order management.',
      ar: 'نواة إنتاجية مبنية على Laravel 12 لمطعم يمني فاخر، مع قوائم متعددة اللغات ونظام حجوزات وإدارة طلبات.',
    },
    fullDescription: {
      en: 'A single-branch, performance-first Laravel 12 domain architecture built for a premium Yemeni restaurant in the Netherlands. It covers restaurant settings, multilingual menu management, table reservations, and takeaway/dine-in orders — backed by native JSON localization (NL/AR/EN), type-safe PHP 8 backed enums wired into the Filament v4 dashboard, secure public reference codes, and historical price snapshots for financial accuracy.',
      ar: 'معمارية نطاق مبنية على Laravel 12 بأداء عالٍ ومصممة لفرع واحد لمطعم يمني فاخر في هولندا. تشمل إعدادات المطعم وإدارة القوائم متعددة اللغات وحجوزات الطاولات وطلبات الاستلام والطلب الداخلي، مدعومة بترجمة JSON أصلية (NL/AR/EN) وEnums مُحكمة الأنواع في PHP 8 مرتبطة مباشرة بلوحة Filament v4، ومراجع عامة آمنة، ولقطات تاريخية للأسعار تضمن دقة السجلات المالية.',
    },
    thumbnail: '/assets/images/project_restaurant_platform.jpg',
    technologies: ['Laravel 12', 'PHP 8', 'Filament v4', 'MySQL', 'Spatie Translatable'],
    githubUrl: 'https://github.com/salman-dev-ai/jemenitische-keuken',
    featured: true,
    highlights: {
      en: [
        'Single-branch schema stripped of unnecessary relational complexity (KISS & YAGNI)',
        'Native JSON localization for NL, AR, and EN via spatie/laravel-translatable',
        'Type-safe PHP 8 backed enums (ReservationStatus, OrderStatus, OrderType) rendered directly by Filament',
        'Secure public references (e.g. RES-8X29B) generated via Eloquent model events to prevent IDOR',
        'Historical price integrity: order items snapshot the unit price at purchase time',
      ],
      ar: [
        'مخطط بيانات لفرع واحد بلا تعقيدات علائقية غير ضرورية (مبادئ KISS و YAGNI)',
        'ترجمة أصلية بأعمدة JSON للهولندية والعربية والإنجليزية عبر spatie/laravel-translatable',
        'Enums مُحكمة الأنواع في PHP 8 (ReservationStatus و OrderStatus و OrderType) تُعرض مباشرة في Filament',
        'مراجع عامة آمنة (مثل RES-8X29B) تُولَّد عبر أحداث Eloquent لمنع ثغرات IDOR',
        'حفاظ تاريخي على الأسعار: تخزين سعر الوحدة لحظة الشراء في عناصر الطلب',
      ],
    },
  },
  {
    id: 'proj-8',
    slug: 'liver-cirrhosis-prediction',
    title: {
      en: 'Liver Cirrhosis Stage Prediction',
      ar: 'التنبؤ بمراحل تليف الكبد',
    },
    category: {
      en: 'Machine Learning',
      ar: 'تعلم الآلة',
    },
    shortDescription: {
      en: 'Predicting liver cirrhosis progression using Scikit-Learn classification models with 100% reproducible pipelines.',
      ar: 'التنبؤ بتطور تليف الكبد باستخدام نماذج تصنيف Scikit-Learn مع أنابيب معالجة قابلة لإعادة الإنتاج بالكامل.',
    },
    fullDescription: {
      en: 'A complete Data Science project applying Machine Learning to predict the stage of liver cirrhosis using clinical patient data (615 patients, 18 features). Covers the full pipeline: data cleaning with SimpleImputer, exploratory analysis with Pearson & Spearman correlations, feature engineering, and robust preprocessing via ColumnTransformer with StandardScaler and OneHotEncoder. Trains and compares three models — Logistic Regression, Decision Tree, and Random Forest — across both binary and multi-class classification tasks. Includes GridSearchCV hyperparameter tuning (24 combinations) and 5-Fold Cross-Validation for reliable performance evaluation.',
      ar: 'مشروع علم بيانات متكامل يطبق تعلم الآلة للتنبؤ بمرحلة تليف الكبد باستخدام بيانات سريرية للمرضى (615 مريض، 18 خاصية). يغطي الخط الكامل: تنظيف البيانات بـ SimpleImputer، تحليل استكشافي بارتباطات Pearson و Spearman، هندسة الخصائص، ومعالجة مسبقة قوية عبر ColumnTransformer مع StandardScaler و OneHotEncoder. يدرّب ويقارن ثلاثة نماذج — الانحدار اللوجستي وشجرة القرار والغابة العشوائية — عبر مهام التصنيف الثنائي ومتعدد الفئات. يشمل ضبط المعلمات الفائقة بـ GridSearchCV (24 تركيبة) والتحقق المتقاطع بـ 5 طيات لتقييم أداء موثوق.',
    },
    thumbnail: '/assets/images/project_liver_cirrhosis_ml.jpg',
    technologies: ['Python 3', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
    githubUrl: 'https://github.com/salman-dev-ai/HCV',
    featured: false,
    highlights: {
      en: [
        'Complete ML pipeline: data cleaning, EDA, feature engineering, preprocessing, and modeling',
        'Three classification models compared: Logistic Regression, Decision Tree, and Random Forest',
        'Both binary and multi-class classification with side-by-side performance comparison',
        'GridSearchCV hyperparameter tuning across 24 parameter combinations with 5-Fold CV',
        'Robust preprocessing with ColumnTransformer, StandardScaler, and OneHotEncoder',
      ],
      ar: [
        'خط أنابيب تعلم آلة متكامل: تنظيف البيانات، تحليل استكشافي، هندسة خصائص، معالجة مسبقة، ونمذجة',
        'مقارنة ثلاثة نماذج تصنيف: الانحدار اللوجستي وشجرة القرار والغابة العشوائية',
        'تصنيف ثنائي ومتعدد الفئات مع مقارنة الأداء جنباً إلى جنب',
        'ضبط المعلمات الفائقة بـ GridSearchCV عبر 24 تركيبة مع تحقق متقاطع بـ 5 طيات',
        'معالجة مسبقة قوية بـ ColumnTransformer و StandardScaler و OneHotEncoder',
      ],
    },
  },
];
