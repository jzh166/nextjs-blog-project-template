import { getPostBySlug } from '@/utils/posts';
import { notFound } from 'next/navigation';
import { processHtmlContent } from '@/utils/markdown';

interface Props {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
          {post.title}
        </h1>
      </header>
      
      {post.coverImage && (
        <div className="relative w-full h-[400px] mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      )}

      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: processHtmlContent(post.content || '') }}
      />
    </article>
  );
}
