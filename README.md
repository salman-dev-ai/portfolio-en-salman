# Salman Al-Ansi — Portfolio & DevOps Specialist

A production-grade, high-performance static personal portfolio for **Salman Al-Ansi**, Software Engineer and DevOps Specialist. Built with strict fidelity to the reference design specification, featuring an editorial split composition, warm cream (`#FDFBF7`) and deep graphite (`#080D12`) sections, vivid orange accents (`#FF641C`), full bilingual Arabic (RTL, default) and English (LTR) localization, accessible dark/light themes, and client-side project and course exploration.

---

## Technical Stack & Compatibility

- **Framework**: React 19 SPA (Vite 8) configured for zero-runtime static deployment.
- **Language**: TypeScript with strict type checking.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **Icons**: Lucide React.
- **Node.js**: v20+ or v22+ LTS supported.
- **Architecture**: 100% frontend static export; no external runtime databases, APIs, or tracking scripts.

---

## Quick Start & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Accessible at `http://localhost:3000`.

### 3. Run Unit Tests (Filter & Logic Suite)
```bash
node --test src/lib/filters.test.ts
```

### 4. Run TypeScript Check & Linter
```bash
npm run lint
```

### 5. Production Static Build
```bash
npm run build
```
Generates optimized, self-contained production assets in the `dist/` directory.

---

## Project Structure & Architecture

```
/
├── index.html                  # HTML entry point with JSON-LD, fonts & SEO metadata
├── metadata.json               # Applet identity configuration
├── package.json                # Project dependencies and build scripts
├── vite.config.ts              # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                # Application bootstrap
│   ├── App.tsx                 # Root layout, sections orchestration & modals
│   ├── index.css               # Base CSS, font definitions & scrollbar styles
│   ├── types/
│   │   └── portfolio.ts        # TypeScript interfaces (Project, Course, TechItem, etc.)
│   ├── config/
│   │   ├── site.ts             # Central configuration (contact info, CV paths, stats)
│   ├── data/
│   │   ├── projects.ts         # Typed projects collection with bilingual content
│   │   ├── courses.ts          # Typed courses collection (difficulty, lessons, syllabus)
│   │   ├── technologies.ts     # Tech stack categorized by Frontend, Backend, DevOps
│   │   └── testimonials.ts     # Testimonials (including Ahmed Ali)
│   ├── i18n/
│   │   ├── LanguageContext.tsx # Arabic (RTL, default) & English (LTR) provider
│   │   └── messages/
│   │       ├── ar.json         # Arabic translation dictionary
│   │       └── en.json         # English translation dictionary
│   ├── theme/
│   │   └── ThemeContext.tsx    # Light, Dark, and System preference theme provider
│   ├── lib/
│   │   ├── filters.ts          # Pure filtering, search, and categorization logic
│   │   └── filters.test.ts     # Node.js native unit tests for filters
│   ├── assets/
│   │   └── images/             # Local high-resolution optimized visuals
│   └── components/
│       ├── layout/
│       │   ├── SiteHeader.tsx  # Sticky header with 3-zone contract, lang & theme toggles
│       │   └── SiteFooter.tsx  # Minimalist copyright footer with dynamic year
│       ├── home/
│       │   ├── HeroSection.tsx              # Split hero with workspace image & learning card
│       │   ├── ValuePropositionSection.tsx  # 4-card value proposition dark strip
│       │   ├── AboutAndTechSection.tsx      # About Me + Tech Stack grouped grid
│       │   ├── FeaturedProjectsSection.tsx  # Dark projects showcase
│       │   ├── FeaturedCoursesSection.tsx   # Learn & Grow course cards
│       │   ├── TestimonialSection.tsx       # Quote carousel with wireframe globe
│       │   └── ContactBanner.tsx            # Mountain sunset banner & Get in Touch panel
│       ├── projects/
│       │   ├── ProjectModal.tsx             # Detailed single-project preview modal
│       │   └── AllProjectsModal.tsx         # Searchable, filterable projects explorer
│       ├── courses/
│       │   ├── CourseModal.tsx              # Detailed single-course curriculum modal
│       │   └── AllCoursesModal.tsx          # Searchable, filterable courses explorer
│       ├── cv/
│       │   └── CVModal.tsx                  # Bilingual CV download and print preview
│       └── about/
│           └── JourneyVideoModal.tsx        # Interactive documentary video modal
```

---

## How to Customize Content

All content is maintained strictly in typed static files:

### 1. Adding or Editing Projects
Edit `src/data/projects.ts`:
```typescript
{
  id: 'proj-unique-id',
  slug: 'project-slug',
  title: { en: 'Project Title', ar: 'عنوان المشروع' },
  category: { en: 'Web App', ar: 'تطبيق ويب' },
  shortDescription: { en: 'Brief summary', ar: 'ملخص موجز' },
  fullDescription: { en: 'In-depth overview', ar: 'تفاصيل كاملة' },
  thumbnail: '/src/assets/images/...',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  liveUrl: 'https://...',
  githubUrl: 'https://github.com/...',
  featured: true, // Appears in the 3 featured hero cards
  highlights: {
    en: ['Highlight 1', 'Highlight 2'],
    ar: ['ميزة 1', 'ميزة 2'],
  },
}
```

### 2. Adding or Editing Courses
Edit `src/data/courses.ts`:
```typescript
{
  id: 'course-unique-id',
  slug: 'course-slug',
  title: { en: 'Course Name', ar: 'اسم الدورة' },
  category: { en: 'Frontend', ar: 'تطوير الواجهات' },
  difficulty: 'Beginner', // 'Beginner' | 'Intermediate' | 'Advanced'
  lessonsCount: 12,
  durationHours: 6,
  shortDescription: { en: 'Summary', ar: 'ملخص' },
  fullDescription: { en: 'Full description', ar: 'الوصف الكامل' },
  thumbnail: '/src/assets/images/...',
  featured: true,
  syllabus: {
    en: ['Module 1', 'Module 2'],
    ar: ['الوحدة 1', 'الوحدة 2'],
  },
}
```

### 3. Updating Contact Details & CV Links
Edit `src/config/site.ts`:
- Update `email`, `linkedinUrl`, `githubUrl`.
- Update `whatsappNumber` and `whatsappUrl`.
- Put official PDF CVs in `public/cv/` and update `cvEnglishPath` and `cvArabicPath`.

### 4. Updating Translations (Arabic & English)
- Edit `src/i18n/messages/ar.json` for Arabic copy.
- Edit `src/i18n/messages/en.json` for English copy.

---

## Deployment to Cloudflare Pages / Static Hosting

This project compiles directly into a static output directory (`dist/`) without requiring server runtimes or external APIs.

### Cloudflare Pages Configuration:
1. Connect your GitHub repository to Cloudflare Pages.
2. Select **Framework preset**: `None` or `Vite`.
3. Set **Build command**: `npm run build`
4. Set **Build output directory**: `dist`
5. Node.js Version: `20` or higher.
6. Click **Save and Deploy**.
