export const runtime = "nodejs";

import { createClient } from "next-sanity";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs/promises";
import type { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { Readable } from "stream";

// disable formidable’s default body parser
export const config = { api: { bodyParser: false } };

const sanityClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function createNodeRequest(req: Request): Promise<IncomingMessage> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("No request body");

  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  const stream = Readable.from(buffer);

  const nodeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  return nodeReq as unknown as IncomingMessage;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const nodeReq = await createNodeRequest(request);

    return await new Promise((resolve) => {
      const form = new IncomingForm();

      form.parse(
        nodeReq,
        async (err: Error | null, fields: Fields, files: Files) => {
          if (err) {
            resolve(
              NextResponse.json({ error: "Form parse failed" }, { status: 500 })
            );
            return;
          }

          const uploadedFile = Array.isArray(files.file)
            ? files.file[0]
            : files.file;

          const tripId = Array.isArray(fields.tripId)
            ? fields.tripId[0]
            : fields.tripId;

          const field = Array.isArray(fields.field)
            ? fields.field[0]
            : fields.field;

          if (!uploadedFile || typeof uploadedFile.filepath !== "string") {
            resolve(
              NextResponse.json({ error: "No file uploaded" }, { status: 400 })
            );
            return;
          }

          if (!tripId || !field) {
            resolve(
              NextResponse.json(
                { error: "Missing tripId or field" },
                { status: 400 }
              )
            );
            return;
          }

          try {
            const buffer = await fs.readFile(uploadedFile.filepath);

            const assetType = uploadedFile.mimetype?.startsWith("image/")
              ? "image"
              : "file";

            // 1️⃣ Upload asset
            const asset = await sanityClient.assets.upload(assetType, buffer, {
              filename: uploadedFile.originalFilename || "upload",
            });

            // 2️⃣ Patch the trip document
            const updatedDoc = await sanityClient
              .patch(tripId)
              .setIfMissing({ [field]: [] })
              .append(field, [
                {
                  _key: Date.now().toString(), // ✅ unique key for array item
                  _type: assetType,
                  asset: { _type: "reference", _ref: asset._id },
                },
              ])

              .commit();

            resolve(
              NextResponse.json(
                {
                  success: true,
                  assetId: asset._id,
                  url: asset.url,
                  originalFilename: asset.originalFilename,
                  field,
                  updatedDoc,
                },
                { status: 200 }
              )
            );
          } catch (error) {
            const err = error as Error & { response?: { data?: unknown } };
            resolve(
              new Response(
                JSON.stringify({
                  error: "Upload or patch failed",
                  message: err.message,
                  details: err.response?.data,
                }),
                {
                  status: 500,
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          }
        }
      );
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: "Request stream conversion failed", message: error.message },
      { status: 500 }
    );
  }
}
