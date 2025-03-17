import Image from 'next/image';
import Link from 'next/link';
import { getRecentPosts } from '@/utils/posts';
import { Post } from '@/types/post';

export default function Home() {
  const recentPosts = getRecentPosts();

  return (
    <main className="min-h-screen p-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">zhangj.ing</h1>
          <p className="text-xl text-gray-600">Exploring the world, one story at a time</p>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Recent Posts</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {recentPosts.map((post: Post) => (
            <div key={post.slug} className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
              {post.coverImage && (
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h3>
                <time className="text-gray-500 text-sm mb-4 block">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Posts →
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto py-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">About Me</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to my corner of the internet! I'm passionate about exploring new places,
            experiencing different cultures, and sharing my adventures through photography
            and storytelling.
          </p>
          <div className="mt-4">
            <Link 
              href="/about" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more about me →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
