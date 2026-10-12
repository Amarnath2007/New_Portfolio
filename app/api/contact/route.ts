import { NextResponse } from "next/server";
import { Resend } from "resend";

// Simple in-memory rate limiting: IP -> array of timestamps (ms)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

// Clean up stale IP records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((timestamps, ip) => {
      const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, valid);
      }
    });
  }, 15 * 60 * 1000);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    // 1. Client IP tracking for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "unknown-ip";

    if (clientIp !== "unknown-ip" && isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many messages sent. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, email, subject, message, hp } = body;

    // 3. Honeypot check (spam protection)
    // If hidden honeypot field was filled out, pretend success but do not send
    if (hp && typeof hp === "string" && hp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully.",
      });
    }

    // 4. Server-side validation
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedSubject = typeof subject === "string" ? subject.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (2 to 100 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 120) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!trimmedSubject || trimmedSubject.length < 2 || trimmedSubject.length > 150) {
      return NextResponse.json(
        { success: false, error: "Please provide a subject (2 to 150 characters)." },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 3000) {
      return NextResponse.json(
        { success: false, error: "Please provide a message (10 to 3,000 characters)." },
        { status: 400 }
      );
    }

    // 5. Check Resend API configuration
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey || apiKey === "re_your_api_key_here") {
      console.warn("[Contact API] RESEND_API_KEY is not configured in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured yet. The site administrator needs to set RESEND_API_KEY.",
        },
        { status: 503 }
      );
    }

    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL?.trim() || "amarmicrosoft2021@gmail.com";
    const senderEmail =
      process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio Contact <onboarding@resend.dev>";

    // 6. Initialize Resend client
    const resend = new Resend(apiKey);

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeSubject = escapeHtml(trimmedSubject);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, "<br/>");
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0B0C; color: #F4F0E8;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #151517; border: 1px solid #302D28; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #1C1C1F 0%, #151517 100%); border-bottom: 1px solid #302D28;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #C7A46A;">— PORTFOLIO CONTACT —</span>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; color: #F4F0E8;">New Visitor Message</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <!-- Sender Meta Table -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #202023; border: 1px solid #302D28; border-radius: 12px; margin-bottom: 24px; padding: 16px;">
          <tr>
            <td style="padding: 6px 12px; font-size: 13px; color: #A7A198; width: 90px; font-weight: 600;">From:</td>
            <td style="padding: 6px 12px; font-size: 14px; color: #F4F0E8; font-weight: 600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 12px; font-size: 13px; color: #A7A198; font-weight: 600;">Email:</td>
            <td style="padding: 6px 12px; font-size: 14px; color: #C7A46A;"><a href="mailto:${safeEmail}" style="color: #C7A46A; text-decoration: none;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 12px; font-size: 13px; color: #A7A198; font-weight: 600;">Subject:</td>
            <td style="padding: 6px 12px; font-size: 14px; color: #F4F0E8;">${safeSubject}</td>
          </tr>
          <tr>
            <td style="padding: 6px 12px; font-size: 13px; color: #A7A198; font-weight: 600;">Date:</td>
            <td style="padding: 6px 12px; font-size: 13px; color: #A7A198;">${submittedAt} IST</td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #A7A198; margin-bottom: 8px;">Message:</div>
        <div style="background-color: #0B0B0C; border: 1px solid #302D28; border-left: 3px solid #C7A46A; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.6; color: #F4F0E8; white-space: normal;">
          ${safeMessage}
        </div>

        <!-- Quick Reply Action -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(trimmedSubject)}" style="display: inline-block; background-color: #C7A46A; color: #151517; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(199, 164, 106, 0.2);">
            Reply to ${safeName}
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 32px; background-color: #0B0B0C; border-top: 1px solid #302D28; text-align: center; font-size: 11px; color: #736E67;">
        Delivered via Resend from your portfolio website at ${new Date().getFullYear()} • IP: ${clientIp}
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const textContent = `
New message from ${trimmedName} (${trimmedEmail})

Subject: ${trimmedSubject}
Date: ${submittedAt} IST
IP: ${clientIp}

Message:
${trimmedMessage}
    `.trim();

    // 7. Dispatch via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      replyTo: trimmedEmail,
      subject: `[Portfolio] ${trimmedSubject} — from ${trimmedName}`,
      text: textContent,
      html: htmlContent,
    });

    if (resendError) {
      console.error("[Contact API] Resend dispatch error:", resendError);
      return NextResponse.json(
        {
          success: false,
          error:
            resendError.message ||
            "Unable to deliver your message at this time. Please try again later or reach out directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      id: resendData?.id,
    });
  } catch (err: unknown) {
    console.error("[Contact API] Unexpected error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
