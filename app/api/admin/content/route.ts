import { NextResponse } from "next/server";
import {
  getDraftPortfolioData,
  getPublishedPortfolioData,
  saveDraftPortfolioData,
  validatePortfolioData,
  computeDiff,
  PortfolioData,
} from "@/lib/portfolio-data";

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

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const draft = getDraftPortfolioData();
    const published = getPublishedPortfolioData();
    const diffs = computeDiff(draft, published);

    return NextResponse.json({
      draft,
      published,
      hasPendingChanges: diffs.length > 0,
      diffs,
      diffCount: diffs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load portfolio content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const body = await request.json();
    const data: PortfolioData = body.data;

    if (!data) {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    const validation = validatePortfolioData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 422 }
      );
    }

    saveDraftPortfolioData(data);

    const published = getPublishedPortfolioData();
    const diffs = computeDiff(data, published);

    return NextResponse.json({
      success: true,
      message: "Draft saved locally successfully",
      hasPendingChanges: diffs.length > 0,
      diffCount: diffs.length,
      diffs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save draft" },
      { status: 500 }
    );
  }
}
