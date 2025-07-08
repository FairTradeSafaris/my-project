"use client";

export default function DevNotesPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">📝 Dev Notes</h1>
        <div className="space-y-4 text-gray-800">
          <p>
            This portal was built with a focus on modularity, readability, and
            quick access to relevant project content for developers.
          </p>
          <p>
            Code blocks are supported using syntax highlighting, and the Sanity
            CMS is used to provide rich text content with support for structured
            sections.
          </p>
          <p>
            Use this area to drop helpful dev notes, component instructions, or
            anything that can assist the team.
          </p>
        </div>
      </div>
    </main>
  );
}
