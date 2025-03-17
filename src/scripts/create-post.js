const fs = require('fs');
const path = require('path');
const readline = require('readline');

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'posts');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'blog-images');

// Ensure directories exist
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createNewPost() {
  try {
    // Get post details
    const title = await question('Enter post title: ');
    const content = await question('Enter post content (you can use markdown): ');
    const imageName = await question('Enter image filename (from public/blog-images) or press Enter to skip: ');

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create post object
    const post = {
      title,
      date: new Date().toISOString().split('T')[0] + ' 00:00:00',
      content,
      excerpt: content.slice(0, 150) + '...',
      slug,
      coverImage: imageName ? `/blog-images/${imageName}` : undefined
    };

    // Save individual post
    fs.writeFileSync(
      path.join(POSTS_DIR, `${slug}.json`),
      JSON.stringify(post, null, 2)
    );

    // Update posts index
    const postsIndexPath = path.join(POSTS_DIR, 'posts.json');
    let postsIndex = { posts: [] };
    
    if (fs.existsSync(postsIndexPath)) {
      postsIndex = JSON.parse(fs.readFileSync(postsIndexPath, 'utf-8'));
    }

    // Add new post to index
    postsIndex.posts.push({
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      slug: post.slug,
      coverImage: post.coverImage
    });

    // Sort posts by date (newest first)
    postsIndex.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save updated index
    fs.writeFileSync(postsIndexPath, JSON.stringify(postsIndex, null, 2));

    console.log(`\nPost "${title}" created successfully!`);
    console.log(`Slug: ${slug}`);
    if (post.coverImage) {
      console.log(`Image: ${post.coverImage}`);
    }
  } catch (error) {
    console.error('Error creating post:', error);
  } finally {
    rl.close();
  }
}

createNewPost();
