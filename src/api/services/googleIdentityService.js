import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export function googleClientId() { return String(process.env.GOOGLE_CLIENT_ID || "").trim(); }
export function isGoogleSignInConfigured() { return Boolean(googleClientId()); }

export async function verifyGoogleIdToken(credential) {
  if (!isGoogleSignInConfigured()) {
    const error = new Error("Google Sign-In is not configured. Add GOOGLE_CLIENT_ID on the server.");
    error.status = 503;
    throw error;
  }
  const ticket = await client.verifyIdToken({ idToken: credential, audience: googleClientId() });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) {
    const error = new Error("Google did not provide a verified email address.");
    error.status = 401;
    throw error;
  }
  return { email: payload.email.toLowerCase(), fullName: payload.name || payload.given_name || "Google user" };
}
