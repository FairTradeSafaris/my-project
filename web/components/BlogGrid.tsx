type BlogPostPreview = {
  _id: string;
  title: string;
  summary: string;
};

export default function BlogGrid({ posts }: { posts: BlogPostPreview[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">{post.summary}</p>
        </div>
      ))}
    </div>
  );
}
