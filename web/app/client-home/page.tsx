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

  return <ClientHomeContent trips={trips} />;
}
