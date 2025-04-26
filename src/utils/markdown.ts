import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

/**
 * Get all markdown files from a specific content directory
 */
export function getMarkdownFiles(directory: string): string[] {
  const fullPath = path.join(CONTENT_DIR, directory);
  
  // Ensure the directory exists
  if (!fs.existsSync(fullPath)) {
    console.log(`Directory not found: ${fullPath}`);
    return [];
  }
  
  try {
    const files = fs.readdirSync(fullPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    console.log(`Found ${mdFiles.length} markdown files in ${directory}: ${mdFiles.join(', ')}`);
    return mdFiles;
  } catch (error) {
    console.error(`Error reading directory ${fullPath}:`, error);
    return [];
  }
}

/**
 * Parse a markdown file and extract frontmatter and content
 */
export async function parseMarkdownFile(directory: string, filename: string) {
  const fullPath = path.join(CONTENT_DIR, directory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parse the frontmatter and content
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML
  const processedContent = await markdownToHtml(content);
  
  // Generate slug from filename (remove .md extension)
  const slug = filename.replace(/\.md$/, '');
  
  return {
    slug,
    ...data,
    content: processedContent
  };
}

/**
 * Convert markdown string to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);
    
  return result.toString();
}

/**
 * Process HTML content and fix URLs if needed
 */
export function processHtmlContent(content: string): string {
  // Replace external image URLs with local paths if needed
  let processedContent = content.replace(
    /https:\/\/zhangj\.ing\/wp-content\/uploads\//g, 
    '/blog-images/'
  );
  
  // Replace external video URLs with local paths if needed
  processedContent = processedContent.replace(
    /https:\/\/zhangj\.ing\/wp-content\/uploads\/(\S+?)\.mp4/g,
    '/blog-images/$1.mp4'
  );
  
  return processedContent;
}
