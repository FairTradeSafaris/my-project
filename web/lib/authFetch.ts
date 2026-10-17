// lib/authFetch.ts
// Browser helper: fetch() that also sends the current Clerk session token as
// "Authorization: Bearer ...". The session cookie is still sent as before;
// the header just makes the server check reliable when the cookie is stale.
// Uses window.Clerk (no React hook), so it is safe where ClerkProvider is not
// mounted: it then behaves exactly like fetch().
type ClerkLike = { session?: { getToken: () => Promise<string | null> } | null };

export async function authFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  let token: string | null = null;
  try {
    const clerk = (window as unknown as { Clerk?: ClerkLike }).Clerk;
    token = (await clerk?.session?.getToken()) ?? null;
  } catch {
    token = null;
  }
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
