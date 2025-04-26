import { Post } from '@/types/post';
import fs from 'fs';
import path from 'path';
import { getMarkdownFiles, parseMarkdownFile, processHtmlContent } from './markdown';

// Keep original JSON directory for backward compatibility during transition
// Note: This directory might not exist anymore if you've fully migrated to Markdown
const POSTS_JSON_DIR = path.join(process.cwd(), 'src', 'data', 'posts');
// New markdown directory 
const POSTS_MD_DIR = 'blog'; // This is relative to the content directory

export async function getAllPosts(): Promise<Post[]> {
  let posts: Post[] = [];
  let markdownSlugs: string[] = []; // Track slugs from markdown files
  
  try {
    // First try to get markdown files (new format)
    const mdFiles = getMarkdownFiles(POSTS_MD_DIR);
    
    if (mdFiles && mdFiles.length > 0) {
      // If we have markdown files, use those
      console.log(`Found ${mdFiles.length} markdown posts in ${POSTS_MD_DIR}: ${mdFiles.join(', ')}`);
      
      const mdPosts = await Promise.all(
        mdFiles.map(file => parseMarkdownFile(POSTS_MD_DIR, file))
      );
      
      const validMdPosts = mdPosts.filter(post => post !== null) as Post[];
      posts = [...validMdPosts];
      
      // Track the slugs to avoid duplicates
      markdownSlugs = validMdPosts.map(post => post.slug);
      console.log(`Markdown post slugs: ${markdownSlugs.join(', ')}`);
    } else {
      console.log(`No markdown posts found in ${POSTS_MD_DIR}, checking JSON fallback`);
    }
    
    // Fallback to JSON for any posts not covered by markdown
    if (fs.existsSync(POSTS_JSON_DIR)) {
      // Read all JSON files in the posts directory except posts.json
      const files = fs.readdirSync(POSTS_JSON_DIR)
        .filter(file => file.endsWith('.json') && file !== 'posts.json');

      console.log(`Found ${files.length} JSON posts in ${POSTS_JSON_DIR}`);
      
      const jsonPosts = files.map(file => {
        try {
          const fullPath = path.join(POSTS_JSON_DIR, file);
          const content = fs.readFileSync(fullPath, 'utf-8');
          const post = JSON.parse(content) as Post;
          
          // Skip if we already have this post from markdown
          if (markdownSlugs.includes(post.slug)) {
            console.log(`Skipping JSON post with slug "${post.slug}" because it exists in markdown`);
            return null;
          }
          
          return post;
        } catch (error) {
          console.error(`Error reading post file ${file}:`, error);
          return null;
        }
      }).filter(post => post !== null) as Post[];
      
      // Add JSON posts to our collection
      posts = [...posts, ...jsonPosts];
    } else {
      console.warn(`JSON fallback directory ${POSTS_JSON_DIR} does not exist`);
    }
  } catch (error) {
    console.error('Error getting posts:', error);
    // Return empty array in case of error
    return [];
  }

  // Sort posts by date (newest first)
  return posts.sort((a: Post, b: Post) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getRecentPosts(count = 2): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // First check for a markdown file with this slug
  const mdFiles = getMarkdownFiles(POSTS_MD_DIR);
  const matchingMdFile = mdFiles.find(file => file.replace(/\.md$/, '') === slug);
  
  if (matchingMdFile) {
    // If found in markdown, parse and return it
    return await parseMarkdownFile(POSTS_MD_DIR, matchingMdFile) as Post;
  }
  
  // If not found in markdown, try JSON for backward compatibility
  // First try the direct slug
  let postFile = path.join(POSTS_JSON_DIR, `${slug}.json`);
  
  // If not found, try to find a file that ends with the slug
  if (!fs.existsSync(postFile)) {
    const files = fs.readdirSync(POSTS_JSON_DIR);
    const matchingFile = files.find(file => 
      file.endsWith(`${slug}.json`) && file !== 'posts.json'
    );
    
    if (matchingFile) {
      postFile = path.join(POSTS_JSON_DIR, matchingFile);
    } else {
      return null;
    }
  }

  // Return the JSON post if found
  return JSON.parse(fs.readFileSync(postFile, 'utf-8'));
}
