import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/utils/projects';
import React from 'react';
import { processHtmlContent } from '@/utils/markdown';

// Function to render different content types
function renderContent(content: any): React.ReactNode {
  // If content is a string, process it as before
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: processHtmlContent(content) }} />;
  }
  
  // If content is an array, render each item properly
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((item, index) => {
          if (item.type === 'paragraph') {
            return <p key={index} className="my-4">{item.text}</p>;
          } else if (item.type === 'image') {
            return (
              <figure key={index} className="my-8">
                <img 
                  src={item.url} 
                  alt={item.caption || ''} 
                  className="rounded-lg mx-auto max-w-full h-auto"
                />
                {item.caption && item.caption.trim() !== " " && (
                  <figcaption className="text-center text-gray-500 mt-2">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </>
    );
  }
  
  return null;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {project.coverImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <time className="text-gray-500 text-sm">
              {new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            <div className="flex flex-wrap gap-2">
              {project.technologies && project.technologies.map((tech, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {(project.githubUrl || project.paperUrl) && (
            <div className="flex gap-4 mb-6">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  View on GitHub
                </a>
              )}
              
              {project.paperUrl && (
                <a 
                  href={project.paperUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Read Paper
                </a>
              )}
            </div>
          )}
          
          <div className="prose prose-blue max-w-none">
            {renderContent(project.content)}
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <Link 
              href="/project" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
