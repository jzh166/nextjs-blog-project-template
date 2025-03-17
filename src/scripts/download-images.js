const fs = require('fs');
const path = require('path');
const https = require('https');

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'posts');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'blog-images');

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filename, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function processImages() {
  // Create images directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }

  // Read posts index
  const postsFile = path.join(POSTS_DIR, 'posts.json');
  if (!fs.existsSync(postsFile)) {
    console.error('Posts file not found. Run import-posts first.');
    process.exit(1);
  }

  const { posts } = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  const updatedPosts = [];

  for (const post of posts) {
    if (post.coverImage && post.coverImage.startsWith('https://zhangj.ing')) {
      const filename = post.coverImage.split('/').pop();
      const localPath = path.join(PUBLIC_IMAGES_DIR, filename);
      
      try {
        console.log(`Downloading: ${post.coverImage}`);
        await downloadImage(post.coverImage, localPath);
        post.coverImage = `/blog-images/${filename}`;
        console.log(`Successfully downloaded to: ${localPath}`);
      } catch (error) {
        console.error(`Failed to download ${post.coverImage}:`, error);
        post.coverImage = null;
      }
    }
    updatedPosts.push(post);
  }

  // Update posts.json with local image paths
  fs.writeFileSync(postsFile, JSON.stringify({ posts: updatedPosts }, null, 2));
  console.log('Updated posts.json with local image paths');
}

processImages().catch(console.error);
