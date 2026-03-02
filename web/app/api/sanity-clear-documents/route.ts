import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const sanityToken = process.env.SANITY_API_TOKEN!;
    const projectId = process.env.SANITY_PROJECT_ID!;
    const dataset = process.env.SANITY_DATASET!;

    // 🔍 Find Trip (EMAIL ONLY — EXACT SAME AS WEBHOOK)
    const query = `*[_type=="trip" && clientEmail==$email][0]{_id}`;
    const queryUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${encodeURIComponent(
      query,
    )}&$email="${email}"`;

    const queryRes = await fetch(queryUrl, {
      headers: { Authorization: `Bearer ${sanityToken}` },
    });

    const queryJson = await queryRes.json();
    const tripId = queryJson.result?._id;

    if (!tripId) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // 🧹 Clear Documents
    const mutateRes = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sanityToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: tripId,
                set: { documents: [] },
              },
            },
          ],
        }),
      },
    );

    if (!mutateRes.ok) {
      throw new Error(await mutateRes.text());
    }

    return NextResponse.json({
      success: true,
      tripId,
    });
  } catch (err) {
    console.error("❌ Clear documents failed:", err);
    return NextResponse.json(
      { error: "Clear service failed" },
      { status: 500 },
    );
  }
}
