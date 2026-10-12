import { NextRequest, NextResponse } from "next/server";
import { parseGoogleDriveUrl } from "@/lib/google-drive";

function isAuthorized(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL === "1") {
    return false;
  }
  const host = request.headers.get("host") || "";
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const gdrive = parseGoogleDriveUrl(url);
  if (!gdrive.isGoogleDrive || !gdrive.fileId) {
    return NextResponse.json({
      isGoogleDrive: false,
      accessible: true,
      fileType: "unknown",
      message: "Non-Google Drive URL entered",
    });
  }

  const fileId = gdrive.fileId;
  const testUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Range: "bytes=0-1024", // Request only the first 1KB to test accessibility quickly
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const finalUrl = response.url || "";
    const contentType = (response.headers.get("content-type") || "").toLowerCase();

    // Check if redirected to Google sign-in / accounts page (means restricted access!)
    if (finalUrl.includes("accounts.google.com") || finalUrl.includes("ServiceLogin")) {
      return NextResponse.json({
        isGoogleDrive: true,
        fileId,
        accessible: false,
        fileType: "restricted",
        thumbnailUrl: gdrive.thumbnailUrl,
        directImageUrl: gdrive.directImageUrl,
        error: "Google Drive File is Restricted (Not Public)",
        hint: "In Google Drive, click 'Share' on this file → change 'General access' to 'Anyone with the link' (Viewer).",
      });
    }

    if (!response.ok) {
      return NextResponse.json({
        isGoogleDrive: true,
        fileId,
        accessible: false,
        fileType: "unknown",
        thumbnailUrl: gdrive.thumbnailUrl,
        directImageUrl: gdrive.directImageUrl,
        error: `Google returned HTTP status ${response.status}`,
        hint: "Please ensure this Google Drive link is valid and shared with 'Anyone with the link'.",
      });
    }

    // Determine type
    let fileType: "pdf" | "image" | "html" | "unknown" = "unknown";
    if (contentType.includes("pdf")) {
      fileType = "pdf";
    } else if (contentType.includes("image")) {
      fileType = "image";
    } else if (contentType.includes("html")) {
      // Sometimes Google shows a virus scan confirm page for files over 100MB
      fileType = "unknown";
    }

    return NextResponse.json({
      isGoogleDrive: true,
      fileId,
      accessible: true,
      fileType,
      contentType,
      thumbnailUrl: gdrive.thumbnailUrl,
      directImageUrl: gdrive.directImageUrl,
      directDownloadUrl: gdrive.directDownloadUrl,
      viewUrl: gdrive.viewUrl,
      message:
        fileType === "pdf"
          ? "PDF certificate verified. Will display in your custom Certificate Viewer."
          : fileType === "image"
          ? "Image verified. Will display directly as high-res preview."
          : "File is accessible via Google Drive.",
    });
  } catch (err: any) {
    // If request timed out or network error, still provide fileId and URL
    return NextResponse.json({
      isGoogleDrive: true,
      fileId,
      accessible: true, // assume tentatively accessible
      fileType: "unknown",
      thumbnailUrl: gdrive.thumbnailUrl,
      directImageUrl: gdrive.directImageUrl,
      warning: "Could not reach Google Drive immediately; preview might take a moment to load.",
    });
  }
}
