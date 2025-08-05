import { auth } from "@clerk/nextjs/server";
import ClientHomeContent from "./ClientHomeContent";
import { sanityClient } from "../../lib/client";

export default async function ClientHomePage() {
  const { userId } = await auth();

  let trips = [];

  if (userId) {
    trips = await sanityClient.fetch(
      `*[_type == "trip" && clerkUserId == $userId] {
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
      }`,
      { userId }
    );
  }

  // TEMPORARY DEBUG: Log to server console
  console.log("TRIPS DEBUG:", trips);

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
          <strong>Trips array length:</strong> {trips.length}
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
