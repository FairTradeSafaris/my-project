import { auth } from "@clerk/nextjs/server";
import ClientHomeContent from "./ClientHomeContent";
import { sanityClient } from "../../lib/client";

export default async function ClientHomePage() {
  const { userId } = await auth();

  // Fetch ALL trips, ignoring clerkUserId, for debugging
  let trips = [];

  trips = await sanityClient.fetch(
    `*[_type == "trip"] {
      ...,
      destination-> {
        name,
        slug
      },
      documents[] {
        _key,
        label,
        file {
          asset-> {
            url,
            originalFilename,
            mimeType
          }
        }
      },
      passportUploads[] {
        asset-> {
          url,
          originalFilename,
          mimeType
        }
      },
      flightTicketUploads[] {
        asset-> {
          url,
          originalFilename,
          mimeType
        }
      }
    }`
  );

  // TEMPORARY DEBUG: Log to server console
  console.log("ALL TRIPS DEBUG:", trips);

  return (
    <>
      {/* TEMPORARY DEBUG - Remove after troubleshooting */}
      <div
        style={{
          background: "#fff3cd",
          color: "#856404",
          padding: "12px",
          margin: "16px 0",
          borderRadius: "8px",
        }}
      >
        <div>
          <strong>Trips array length (ALL):</strong> {trips.length}
        </div>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(trips, null, 2)}
        </pre>
      </div>
      <ClientHomeContent trips={trips} />
    </>
  );
}
