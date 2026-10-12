import { NextRequest, NextResponse } from "next/server";
import { extractGoogleDriveFileId } from "@/lib/google-drive";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let targetUrl = rawUrl.trim();

  // If it's a Google Drive link, resolve to direct download URL
  const fileId = extractGoogleDriveFileId(targetUrl);
  if (fileId) {
    // We add &confirm=t so Google Drive bypasses large file confirmation prompt
    targetUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
  }

  try {
    const response = await fetch(targetUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const finalUrl = response.url || "";
    // If redirected to login page
    if (finalUrl.includes("accounts.google.com") || finalUrl.includes("ServiceLogin")) {
      return NextResponse.json(
        {
          error:
            "This Google Drive file is private/restricted. Please open Google Drive, click Share, and set General Access to 'Anyone with the link' (Viewer).",
          isPermissionError: true,
        },
        { status: 403 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream server returned status ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "application/pdf";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error proxying certificate PDF:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate", details: error.message },
      { status: 500 }
    );
  }
}
