"use client";

export default function TechStackPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧰 Tech Stack</h1>
        <p className="text-gray-700 text-base mb-6">
          Here&apos;s a quick look at the technologies powering this project.
        </p>

        <ul className="list-disc list-inside text-gray-800 space-y-2">
          <li>
            <strong>Frontend:</strong> Next.js, Tailwind CSS, React
          </li>
          <li>
            <strong>CMS:</strong> Sanity.io
          </li>
          <li>
            <strong>Code Blocks:</strong> react-syntax-highlighter
          </li>
          <li>
            <strong>Hosting:</strong> Vercel
          </li>
          <li>
            <strong>Version Control:</strong> Git + GitHub
          </li>
        </ul>
      </div>
    </main>
  );
}
