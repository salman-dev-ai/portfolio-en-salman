// الملف: filters.ts
// الوظيفة: دوال لتصفية المشاريع حسب الفئة والبحث والتقنية والاستخراج الفريد
// المحتوى: filterProjects و getUniqueProjectCategories و getUniqueProjectTechnologies
// الاعتماديات: يستورد نوع Project من types/portfolio.ts
import type { Project } from '../types/portfolio.ts';

/**
 * Filter projects by category, search query, and technology
 */
export function filterProjects(
  projects: Project[],
  options: {
    category?: string;
    searchQuery?: string;
    technology?: string;
    locale?: 'en' | 'ar';
  }
): Project[] {
  const { category, searchQuery, technology } = options;
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  return projects.filter((project) => {
    // Category match
    if (category && category !== 'all') {
      const matchCat =
        project.category.en.toLowerCase() === category.toLowerCase() ||
        project.category.ar === category;
      if (!matchCat) return false;
    }

    // Technology match
    if (technology && technology !== 'all') {
      const hasTech = project.technologies.some(
        (t) => t.toLowerCase() === technology.toLowerCase()
      );
      if (!hasTech) return false;
    }

    // Search query match across title, descriptions, and tech tags
    if (normalizedQuery) {
      const titleMatch =
        project.title.en.toLowerCase().includes(normalizedQuery) ||
        project.title.ar.toLowerCase().includes(normalizedQuery);
      const descMatch =
        project.shortDescription.en.toLowerCase().includes(normalizedQuery) ||
        project.shortDescription.ar.toLowerCase().includes(normalizedQuery);
      const techMatch = project.technologies.some((t) =>
        t.toLowerCase().includes(normalizedQuery)
      );

      if (!titleMatch && !descMatch && !techMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Extract unique categories from projects list
 */
export function getUniqueProjectCategories(projects: Project[], locale: 'en' | 'ar' = 'en'): string[] {
  const categories = projects.map((p) => p.category[locale]);
  return Array.from(new Set(categories));
}

/**
 * Extract unique technologies from projects list
 */
export function getUniqueProjectTechnologies(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => {
    p.technologies.forEach((t) => set.add(t));
  });
  return Array.from(set).sort();
}
