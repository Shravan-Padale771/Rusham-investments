
import { NextResponse } from "next/server";
import { contactSchema, toFieldErrors } from "@/lib/validation";
import { getClientIp, getRateLimiter } from "@/lib/rate-limit";
import { isEmailConfigured, sendEnquiryEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 1_500;

const json = (
  body: Record<string, unknown>,
  status = 200,
  headers?: HeadersInit,
) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

const GENERIC_ERROR =
  "We couldn't send your enquiry right now. Please try again in a little while.";

export async function POST(request: Request) {
  // 1. Same-origin check
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json({ ok: false, message: "Request not allowed." }, 403);
      }
    } catch {
      return json({ ok: false, message: "Request not allowed." }, 403);
    }
  }

  // 2. Payload size guard
  const declared = Number(request.headers.get("content-length") ?? 0);

  if (declared > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Your message is too large." }, 413);
  }

  // 3. Rate limiting
  const ip = getClientIp(request.headers);
  const limit = await getRateLimiter().limit(ip);

  if (!limit.allowed) {
    return json(
      {
        ok: false,
        message: "Too many enquiries. Please try again a little later.",
      },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  // 4. Parse request body
  let payload: unknown;

  try {
    const raw = await request.text();

    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, message: "Your message is too large." }, 413);
    }

    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // 5. Honeypot spam protection
  if (
    payload &&
    typeof payload === "object" &&
    typeof (payload as Record<string, unknown>).website === "string" &&
    ((payload as Record<string, unknown>).website as string).trim() !== ""
  ) {
    return json({ ok: true });
  }

  // 6. Server-side validation
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Please check the highlighted fields.",
        errors: toFieldErrors(parsed.error),
      },
      422,
    );
  }

  const data = parsed.data;

  // 7. Submission timing check
  if (
    typeof data.startedAt === "number" &&
    Date.now() - data.startedAt < MIN_FILL_MS
  ) {
    return json(
      {
        ok: false,
        message: "Please take a moment to review your message and try again.",
      },
      400,
    );
  }

  // 8. Check SMTP configuration
  if (!isEmailConfigured()) {
    console.error("[contact] SMTP is not configured.");
    return json({ ok: false, message: GENERIC_ERROR }, 503);
  }

  // 9. Send notification and acknowledgement emails
  try {
    const result = await sendEnquiryEmails(data);

    if (!result.notified) {
      return json({ ok: false, message: GENERIC_ERROR }, 503);
    }

    return json({
      ok: true,
      message: "Your enquiry has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "[contact] notification email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return json({ ok: false, message: GENERIC_ERROR }, 503);
  }
}

export async function GET() {
  return json(
    { ok: false, message: "Method not allowed." },
    405,
    { Allow: "POST" },
  );
}
