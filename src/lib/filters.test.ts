// الملف: filters.test.ts
// الوظيفة: اختبارات وحدة لدوال التصفية والاستخراج باستخدام node:test
// المحتوى: بيانات وهمية mockProjects وأربعة اختبارات للنتائج المتوقعة
// الاعتماديات: يستورد node:test و node:assert/strict ودوال filters.ts وأنواع portfolio
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  getUniqueProjectCategories,
  getUniqueProjectTechnologies,
} from './filters.ts';
import type { Project } from '../types/portfolio.ts';

const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'ecommerce',
    title: { en: 'E-Commerce Platform', ar: 'منصة التجارة الإلكترونية' },
    category: { en: 'Web App', ar: 'تطبيق ويب' },
    shortDescription: { en: 'Stripe payments and shop', ar: 'متجر ومدفوعات' },
    fullDescription: { en: 'Full desc', ar: 'وصف كامل' },
    thumbnail: '/img1.jpg',
    technologies: ['Next.js', 'Tailwind CSS', 'Stripe'],
    featured: true,
    highlights: { en: ['Fast'], ar: ['سريع'] },
  },
  {
    id: '2',
    slug: 'taskapp',
    title: { en: 'Task Management App', ar: 'تطبيق المهام' },
    category: { en: 'Web App', ar: 'تطبيق ويب' },
    shortDescription: { en: 'Real-time kanban', ar: 'كانبان لحظي' },
    fullDescription: { en: 'Full desc 2', ar: 'وصف كامل 2' },
    thumbnail: '/img2.jpg',
    technologies: ['React', 'Firebase'],
    featured: true,
    highlights: { en: ['Realtime'], ar: ['فوري'] },
  },
  {
    id: '3',
    slug: 'cicd',
    title: { en: 'DevOps Pipeline', ar: 'منظومة ديف أوبس' },
    category: { en: 'DevOps', ar: 'ديف أوبس' },
    shortDescription: { en: 'Docker deployment', ar: 'نشر دوكر' },
    fullDescription: { en: 'Full desc 3', ar: 'وصف كامل 3' },
    thumbnail: '/img3.jpg',
    technologies: ['Docker', 'Linux'],
    featured: false,
    highlights: { en: ['Zero downtime'], ar: ['بدون توقف'] },
  },
];

test('filterProjects filters by search query matching english title', () => {
  const result = filterProjects(mockProjects, { searchQuery: 'commerce' });
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, 'ecommerce');
});

test('filterProjects filters by search query matching arabic title', () => {
  const result = filterProjects(mockProjects, { searchQuery: 'المهام' });
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, 'taskapp');
});

test('filterProjects filters by category', () => {
  const webApps = filterProjects(mockProjects, { category: 'Web App' });
  assert.equal(webApps.length, 2);

  const devops = filterProjects(mockProjects, { category: 'DevOps' });
  assert.equal(devops.length, 1);
  assert.equal(devops[0].slug, 'cicd');
});

test('filterProjects filters by technology', () => {
  const result = filterProjects(mockProjects, { technology: 'Docker' });
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, 'cicd');
});

test('getUniqueProjectCategories and Technologies return distinct lists', () => {
  const cats = getUniqueProjectCategories(mockProjects, 'en');
  assert.deepEqual(cats.sort(), ['DevOps', 'Web App'].sort());

  const techs = getUniqueProjectTechnologies(mockProjects);
  assert.ok(techs.includes('Next.js'));
  assert.ok(techs.includes('Docker'));
  assert.ok(techs.includes('Tailwind CSS'));
});
