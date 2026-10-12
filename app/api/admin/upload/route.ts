import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum allowed size of 15MB" },
        { status: 400 }
      );
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `File type ${ext} is not allowed. Supported formats: images (JPG, PNG, WebP, SVG) and PDFs.` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid MIME type: ${file.type}` },
        { status: 400 }
      );
    }

    // Sanitize base filename and prevent directory traversal
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);

    const safeFileName = `${Date.now()}-${baseName}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, safeFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeFileName,
      originalName,
      size: file.size,
      type: ext === ".pdf" ? "pdf" : "image",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const fileNames = fs.readdirSync(uploadsDir);
    const files = fileNames.map((name) => {
      const fullPath = path.join(uploadsDir, name);
      const stat = fs.statSync(fullPath);
      const ext = path.extname(name).toLowerCase();
      return {
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        createdAt: stat.birthtimeMs,
        type: ext === ".pdf" ? "pdf" : "image",
      };
    });

    files.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to list uploads" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const target = body.url || body.fileName;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { error: "No file URL or fileName provided" },
        { status: 400 }
      );
    }

    const cleanBase = path.basename(target);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const fullPath = path.join(uploadsDir, cleanBase);

    // Guard against path traversal
    if (!fullPath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return NextResponse.json({
        success: true,
        message: `File ${cleanBase} deleted successfully`,
        fileName: cleanBase,
      });
    }

    return NextResponse.json({
      success: true,
      message: `File was not found on disk, but cleared successfully`,
      fileName: cleanBase,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
