import { Project } from '@/types/project';
import fs from 'fs';
import path from 'path';
import { getMarkdownFiles, parseMarkdownFile, processHtmlContent } from './markdown';

// Keep original JSON directory for backward compatibility during transition
const PROJECTS_JSON_DIR = path.join(process.cwd(), 'src', 'data', 'projects');
// New markdown directory
const PROJECTS_MD_DIR = 'projects'; // This is relative to the content directory

export async function getAllProjects(): Promise<Project[]> {
  let projects: Project[] = [];
  
  try {
    // First try to get markdown files (new format)
    const mdFiles = getMarkdownFiles(PROJECTS_MD_DIR);
    
    if (mdFiles && mdFiles.length > 0) {
      // If we have markdown files, use those
      const mdProjects = await Promise.all(
        mdFiles.map(file => parseMarkdownFile(PROJECTS_MD_DIR, file))
      );
      projects = mdProjects.filter(project => project !== null) as Project[];
    } else {
      // Fallback to JSON for backward compatibility
      // Ensure the directory exists
      if (fs.existsSync(PROJECTS_JSON_DIR)) {
        // Read all JSON files in the projects directory
        const files = fs.readdirSync(PROJECTS_JSON_DIR)
          .filter(file => file.endsWith('.json'));
  
        projects = files.map(file => {
          try {
            const fullPath = path.join(PROJECTS_JSON_DIR, file);
            const content = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(content) as Project;
          } catch (error) {
            console.error(`Error reading project file ${file}:`, error);
            return null;
          }
        }).filter(project => project !== null) as Project[];
      }
    }
  } catch (error) {
    console.error('Error getting projects:', error);
    // Return empty array in case of error
    return [];
  }

  // Sort projects by date (newest first)
  // The 'order' field is kept as a fallback if dates are equal
  return projects.sort((a: Project, b: Project) => {
    // Primary sort by date (newest first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    
    // If dates are equal, and both have order values, sort by order
    if (dateComparison === 0 && a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    return dateComparison;
  });
}

export async function getRecentProjects(count = 2): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.slice(0, count);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // First check for a markdown file with this slug
  const mdFiles = getMarkdownFiles(PROJECTS_MD_DIR);
  const matchingMdFile = mdFiles.find(file => file.replace(/\.md$/, '') === slug);
  
  if (matchingMdFile) {
    // If found in markdown, parse and return it
    return await parseMarkdownFile(PROJECTS_MD_DIR, matchingMdFile) as Project;
  }
  
  // If not found in markdown, try JSON for backward compatibility
  // First try the direct slug
  let projectFile = path.join(PROJECTS_JSON_DIR, `${slug}.json`);
  
  // If not found, try to find a file that ends with the slug
  if (!fs.existsSync(projectFile)) {
    const files = fs.readdirSync(PROJECTS_JSON_DIR);
    const matchingFile = files.find(file => 
      file.endsWith(`${slug}.json`)
    );
    
    if (matchingFile) {
      projectFile = path.join(PROJECTS_JSON_DIR, matchingFile);
    } else {
      return null;
    }
  }

  if (!fs.existsSync(projectFile)) {
    return null;
  }

  // Return the JSON project if found
  return JSON.parse(fs.readFileSync(projectFile, 'utf-8'));
}
