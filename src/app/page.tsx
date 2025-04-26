import Image from 'next/image';
import Link from 'next/link';
import { getRecentPosts } from '@/utils/posts';
import { Post } from '@/types/post';
import { getRecentProjects } from '@/utils/projects';
import { Project } from '@/types/project';

export default async function Home() {
  // Fetch the latest content with proper error handling
  let recentPosts: Post[] = [];
  let recentProjects: Project[] = [];
  
  try {
    recentPosts = await getRecentPosts(1);
    console.log("Recent posts on homepage:", recentPosts);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
  }
  
  try {
    recentProjects = await getRecentProjects(1);
    console.log("Recent projects on homepage:", recentProjects);
  } catch (error) {
    console.error("Error fetching recent projects:", error);
  }

  return (
    <main className="min-h-screen p-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">zhangj.ing</h1>
          <p className="text-xl text-gray-600">Love life more than the meaning of it</p>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Latest Updates</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Latest Project */}
          {recentProjects.length > 0 && (
            <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
              {recentProjects[0].coverImage && (
                <div className="relative h-48">
                  <Image
                    src={recentProjects[0].coverImage}
                    alt={recentProjects[0].title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Project</span>
                  {recentProjects[0].technologies && recentProjects[0].technologies.slice(0, 2).map((tech: string, index: number) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-1">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{recentProjects[0].title}</h3>
                <time className="text-gray-500 text-sm mb-4 block">
                  {new Date(recentProjects[0].date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <p className="text-gray-600 mb-4 leading-relaxed">{recentProjects[0].excerpt}</p>
                <Link 
                  href={`/project/${recentProjects[0].slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Project →
                </Link>
              </div>
            </div>
          )}

          {/* Latest Post */}
          {recentPosts.length > 0 && (
            <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
              {recentPosts[0].coverImage && (
                <div className="relative h-48">
                  <Image
                    src={recentPosts[0].coverImage}
                    alt={recentPosts[0].title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Blog</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{recentPosts[0].title}</h3>
                <time className="text-gray-500 text-sm mb-4 block">
                  {new Date(recentPosts[0].date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <p className="text-gray-600 mb-4 leading-relaxed">{recentPosts[0].excerpt}</p>
                <Link 
                  href={`/blog/${recentPosts[0].slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <Link 
            href="/project" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Projects →
          </Link>
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
