export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("LIKING POST ID:", id); // ✅ Log this

  try {
    const result = await client
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit({ autoGenerateArrayKeys: true });

    console.log("LIKES UPDATED:", result.likes); // ✅ And this

    return NextResponse.json({ likes: result.likes });
  } catch (error) {
    console.error("API ERROR:", error); // ✅ Make sure this shows
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
