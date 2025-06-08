type Props = {
  title: string;
  summary: string;
  imageUrl?: string;
  alt?: string;
};

export default function JourneyCard({ title, summary, imageUrl, alt }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt || "Journey image"}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-700">{summary}</p>
      </div>
    </div>
  );
}
