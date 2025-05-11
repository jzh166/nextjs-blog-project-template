# Next.js Blog & Project Portfolio Template

A modern, responsive template for creating a personal blog and project portfolio website using Next.js, TypeScript, and Tailwind CSS. This template extends the Vercel Blog Starter Kit with additional features like a dedicated Projects section.

## 🌟 Features

- **Blog Section**: Easily create and manage blog posts using Markdown
- **Project Portfolio**: Showcase your projects with details like technologies used, GitHub links, and live demos
- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Modern Tech Stack**: 
  - Next.js 14+ with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
- **SEO Friendly**: Built with best practices for search engine optimization
- **Image Optimization**: Automatic image optimization using Next.js Image component
- **Easy Content Management**: Simple file-based content system using Markdown and JSON

## 📋 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/nextjs-blog-project-template.git
   cd nextjs-blog-project-template
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 Creating Content

### Blog Posts

1. Create a new Markdown file in `src/content/blog/` with the format `YYYY-MM-DD-title.md`
2. Add front matter at the top of the file:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-05-01"
   excerpt: "A brief description of your post"
   coverImage: "/blog-images/your-image.jpg"
   ---

   Your post content here...
   ```
3. Run `npm run build-posts` to generate the JSON files for your blog posts

### Projects

1. Create a new Markdown file in `src/content/projects/` with the format `project-name.md`
2. Add front matter at the top of the file:
   ```markdown
   ---
   title: "Your Project Title"
   date: "2025-05-01"
   excerpt: "A brief description of your project"
   coverImage: "/project-images/your-image.png"
   technologies: ["React", "Node.js", "MongoDB"]
   github: "https://github.com/your-username/your-repo"
   demo: "https://your-demo-link.com"
   ---

   Your project description here...
   ```
3. Run `npm run build-posts` to generate the JSON files for your projects

## 🔧 Customization

### Styling

- Edit the Tailwind configuration in `tailwind.config.js`
- Modify global styles in `src/app/globals.css`

### Layout and Components

- Update the site layout in `src/app/layout.tsx`
- Modify the navigation in `src/components/Navbar.tsx`
- Customize page components in `src/app/` directory

## 🚀 Deployment

This template is optimized for deployment on Vercel, but can be deployed to any platform that supports Next.js:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nextjs-blog-project-template)

## 🙏 Acknowledgements

This template is based on [Vercel's Blog Starter Kit](https://vercel.com/templates/next.js/blog-starter-kit) with additional features and customizations.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Preview creenshots

![Alt text](./template%20screenshot.png) 

![Alt text](./project%20screenshot.png)

![Alt text](./project%20detail%20screenshot.png)
