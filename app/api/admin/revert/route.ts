import { NextResponse } from "next/server";
import { revertDraftToPublished, getPublishedPortfolioData } from "@/lib/portfolio-data";

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

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    revertDraftToPublished();
    const published = getPublishedPortfolioData();

    return NextResponse.json({
      success: true,
      message: "Draft changes discarded. Reverted to published content.",
      data: published,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to revert draft" },
      { status: 500 }
    );
  }
}
