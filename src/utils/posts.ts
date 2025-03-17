import { Post } from '@/types/post';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'posts');

export function getAllPosts(): Post[] {
  // Read all JSON files in the posts directory except posts.json
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.json') && file !== 'posts.json');

  const posts = files.map(file => {
    const fullPath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content) as Post;
  });

  // Sort posts by date (newest first)
  return posts.sort((a: Post, b: Post) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getRecentPosts(count = 2): Post[] {
  const posts = getAllPosts();
  return posts.slice(0, count);
}

export function getPostBySlug(slug: string): Post | null {
  // First try the direct slug
  let postFile = path.join(POSTS_DIR, `${slug}.json`);
  
  // If not found, try to find a file that ends with the slug
  if (!fs.existsSync(postFile)) {
    const files = fs.readdirSync(POSTS_DIR);
    const matchingFile = files.find(file => 
      file.endsWith(`${slug}.json`) && file !== 'posts.json'
    );
    
    if (matchingFile) {
      postFile = path.join(POSTS_DIR, matchingFile);
    } else {
      return null;
    }
  }

  return JSON.parse(fs.readFileSync(postFile, 'utf-8'));
}
