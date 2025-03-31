import { Project } from '@/types/project';
import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = path.join(process.cwd(), 'src', 'data', 'projects');

export function getAllProjects(): Project[] {
  // Ensure the directory exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }

  // Read all JSON files in the projects directory
  const files = fs.readdirSync(PROJECTS_DIR)
    .filter(file => file.endsWith('.json'));

  const projects = files.map(file => {
    const fullPath = path.join(PROJECTS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content) as Project;
  });

  // Sort projects by date (newest first)
  return projects.sort((a: Project, b: Project) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getRecentProjects(count = 2): Project[] {
  const projects = getAllProjects();
  return projects.slice(0, count);
}

export function getProjectBySlug(slug: string): Project | null {
  // First try the direct slug
  let projectFile = path.join(PROJECTS_DIR, `${slug}.json`);
  
  // If not found, try to find a file that ends with the slug
  if (!fs.existsSync(projectFile)) {
    const files = fs.readdirSync(PROJECTS_DIR);
    const matchingFile = files.find(file => 
      file.endsWith(`${slug}.json`)
    );
    
    if (matchingFile) {
      projectFile = path.join(PROJECTS_DIR, matchingFile);
    } else {
      return null;
    }
  }

  if (!fs.existsSync(projectFile)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(projectFile, 'utf-8'));
}
