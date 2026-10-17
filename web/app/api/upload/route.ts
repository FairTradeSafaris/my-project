export const runtime = "nodejs";

import { createClient } from "next-sanity";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs/promises";
import type { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { after } from "next/server";
import { put } from "@vercel/blob";
import { attachToZohoDeal, findDealId } from "@/lib/server/zohoPortal";
import {
  getPortalUser,
  getVerifiedEmails,
  isClientUploadField,
  unauthorized,
} from "@/lib/server/portalAuth";

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
  // 🔐 Must be logged in
  const me = await getPortalUser(request);
  if (!me) return unauthorized();

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

          // 🔐 Only the passport / flight ticket upload fields
          if (!isClientUploadField(field)) {
            resolve(
              NextResponse.json({ error: "Invalid field" }, { status: 400 })
            );
            return;
          }

          try {
            // 🔐 The trip must belong to the logged-in user
            const emails = await getVerifiedEmails(me.userId);
            const owned: { _id: string; zohoDealId?: string | null } | null =
              emails.length
                ? await sanityClient.fetch(
                    `*[_type == "trip" && _id == $tripId && lower(clientEmail) in $emails][0]{_id, zohoDealId}`,
                    { tripId, emails }
                  )
                : null;
            const ownedId = owned?._id ?? null;

            if (!ownedId) {
              resolve(
                NextResponse.json({ error: "Trip not found" }, { status: 404 })
              );
              return;
            }

            const buffer = await fs.readFile(uploadedFile.filepath);

            const originalName = uploadedFile.originalFilename || "upload";
            const mimeType = uploadedFile.mimetype || "application/octet-stream";
            const assetType = mimeType.startsWith("image/") ? "image" : "file";
            const key = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
            let item: Record<string, unknown>;
            let assetId: string | null = null;

            if (process.env.BLOB_READ_WRITE_TOKEN) {
              // 🔒 Private Vercel Blob storage, random unguessable path,
              // served only through /api/portal-file after an ownership check.
              const ext = (originalName.match(/\.[A-Za-z0-9]{1,8}$/)?.[0] || "").toLowerCase();
              const blob = await put(
                `portal/${ownedId}/${randomUUID()}${ext}`,
                buffer,
                { access: "private", contentType: mimeType, addRandomSuffix: true }
              );
              item = {
                _key: key,
                _type: assetType,
                blobPath: blob.pathname,
                originalFilename: originalName,
                mimeType,
                size: buffer.length,
              };
            } else {
              // Fallback: Sanity asset (same as before batch 10)
              const asset = await sanityClient.assets.upload(assetType, buffer, {
                filename: originalName,
              });
              assetId = asset._id;
              item = {
                _key: key,
                _type: assetType,
                asset: { _type: "reference", _ref: asset._id },
              };
            }

            await sanityClient
              .patch(ownedId)
              .setIfMissing({ [field]: [] })
              .append(field, [item])
              .commit();

            // 📎 Copy to the client's Zoho Deal after the response is sent.
            // Never blocks or fails the upload.
            const meId = me.userId;
            const dealHint = owned?.zohoDealId ?? null;
            after(async () => {
              try {
                const dealId = await findDealId(dealHint, meId);
                await attachToZohoDeal({
                  dealId,
                  label: field === "passportUploads" ? "Passport" : "Flight ticket",
                  originalName,
                  buffer,
                  mimeType,
                });
              } catch (e) {
                console.error(
                  "[upload] zoho copy failed:",
                  e instanceof Error ? e.message : "unknown error"
                );
              }
            });

            resolve(
              NextResponse.json(
                {
                  success: true,
                  key,
                  assetId,
                  originalFilename: originalName,
                  field,
                },
                { status: 200 }
              )
            );
          } catch (error) {
            console.error(
              "[upload] failed:",
              error instanceof Error ? error.message : "unknown error"
            );
            resolve(
              NextResponse.json(
                { error: "Upload or patch failed" },
                { status: 500 }
              )
            );
          }
        }
      );
    });
  } catch {
    return NextResponse.json(
      { error: "Request stream conversion failed" },
      { status: 500 }
    );
  }
}
