const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const removeMd = require('remove-markdown');

const XML_PATH = 'D:/readmore/website/siteground_202503/zhangjing.WordPress.2025-03-16.xml';
const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'posts');

function parseWordPressXML(xmlPath) {
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    ignoreDeclaration: true,
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c"
  });

  const parsed = parser.parse(xmlData);
  const items = parsed.rss.channel.item || [];

  return items
    .filter(item => item['wp:post_type'] === 'post')
    .map(item => {
      const content = item['content:encoded']?.__cdata || item['content:encoded'] || '';
      const excerpt = item['excerpt:encoded']?.__cdata || item['excerpt:encoded'] || '';
      const plainExcerpt = removeMd(excerpt || content.slice(0, 300)).trim();
      
      return {
        title: item.title?.__cdata || item.title || '',
        date: item['wp:post_date'] || '',
        content: content,
        excerpt: plainExcerpt + (plainExcerpt.length >= 300 ? '...' : ''),
        slug: item['wp:post_name'] || '',
        coverImage: extractCoverImage(content)
      };
    });
}

function extractCoverImage(content) {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}

function savePosts(posts) {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const postsData = {
    posts: posts.map(post => ({
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      slug: post.slug,
      coverImage: post.coverImage
    }))
  };

  // Save posts index
  fs.writeFileSync(
    path.join(POSTS_DIR, 'posts.json'),
    JSON.stringify(postsData, null, 2)
  );

  // Save individual post content
  posts.forEach(post => {
    fs.writeFileSync(
      path.join(POSTS_DIR, `${post.slug}.json`),
      JSON.stringify(post, null, 2)
    );
  });
}

try {
  console.log('Starting import...');
  const posts = parseWordPressXML(XML_PATH);
  console.log(`Found ${posts.length} posts`);
  savePosts(posts);
  console.log('Import completed successfully!');
} catch (error) {
  console.error('Error during import:', error);
  process.exit(1);
}
