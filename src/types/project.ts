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
}
