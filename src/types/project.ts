export interface Project {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string; // URL to the scientific paper or publication
  order?: number;    // Optional field to control display order (lower numbers appear first)
}
