const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const markdownItFigures = require('markdown-it-image-figures');
const removeMd = require('remove-markdown');

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const IMAGES_DIR = path.join(CONTENT_DIR, 'images');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data', 'posts');

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
}).use(markdownItFigures, {
  figcaption: true
});

// Ensure directories exist
[CONTENT_DIR, POSTS_DIR, IMAGES_DIR, OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function processMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const slug = path.basename(filePath, '.md');
  
  // Convert markdown to HTML
  const htmlContent = md.render(content);
  
  // Create clean excerpt
  const plainText = removeMd(content);
  const excerpt = plainText.slice(0, 200).trim() + (plainText.length > 200 ? '...' : '');

  return {
    title: data.title,
    date: data.date,
    coverImage: data.coverImage ? `/content/images/${data.coverImage}` : undefined,
    content: htmlContent,
    excerpt,
    slug
  };
}

function buildPosts() {
  try {
    // Read all markdown files
    const markdownFiles = fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.md'));

    const posts = markdownFiles
      .map(file => processMarkdownFile(path.join(POSTS_DIR, file)))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save individual post files
    posts.forEach(post => {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    });

    // Save posts index
    const postsIndex = {
      posts: posts.map(({ title, date, excerpt, slug, coverImage }) => ({
        title,
        date,
        excerpt,
        slug,
        coverImage
      }))
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'posts.json'),
      JSON.stringify(postsIndex, null, 2)
    );

    console.log(`Successfully processed ${posts.length} posts`);
  } catch (error) {
    console.error('Error building posts:', error);
    process.exit(1);
  }
}

buildPosts();
