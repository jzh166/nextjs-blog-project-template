import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/utils/posts';
import { Post } from '@/types/post';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <div className="grid gap-8">
          {posts && posts.map((post: Post) => (
            <article key={post.slug} className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
              <div className="md:flex">
                {post.coverImage && (
                  <div className="md:w-1/3">
                    <div className="relative h-48 md:h-full min-h-[200px]">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                )}
                <div className="p-6 md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    {post.title}
                  </h2>
                  <time className="text-gray-500 text-sm mb-4 block">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts found. Please run the import script first.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
