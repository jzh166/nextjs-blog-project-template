import Image from 'next/image';
import Link from 'next/link';
import { getAllProjects } from '@/utils/projects';
import { Project } from '@/types/project';

export default async function ProjectPage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Projects</h1>
        <div className="grid gap-8">
          {projects && projects.map((project: Project) => (
            <article key={project.slug} className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
              <div className="md:flex">
                {project.coverImage && (
                  <div className="md:w-1/3">
                    <div className="relative h-48 md:h-full min-h-[200px]">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                )}
                <div className="p-6 md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    {project.title}
                  </h2>
                  <time className="text-gray-500 text-sm mb-2 block">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link 
                      href={`/project/${project.slug}`}
                      className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View details →
                    </Link>
                    
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block text-gray-600 hover:text-gray-800 font-medium"
                      >
                        GitHub
                      </a>
                    )}
                    
                    {project.paperUrl && (
                      <a 
                        href={project.paperUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read paper →
                      </a>
                    )}
                    
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects found. Add project JSON files to the projects directory.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
