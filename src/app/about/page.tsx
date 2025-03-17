import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About Me</h1>
        <div className="prose max-w-none">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Hey it is my first time to build a website from scratch. I will use it to document some of my life moments, experiences, and ideas.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
