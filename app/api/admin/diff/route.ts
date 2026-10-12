import { NextResponse } from "next/server";
import {
  getDraftPortfolioData,
  getPublishedPortfolioData,
  computeDiff,
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

    const summary = {
      skills: diffs.filter((d) => d.section === "skills"),
      achievements: diffs.filter((d) => d.section === "achievements"),
      certifications: diffs.filter((d) => d.section === "certifications"),
      projects: diffs.filter((d) => d.section === "projects"),
    };

    return NextResponse.json({
      diffs,
      summary,
      totalChanges: diffs.length,
      hasChanges: diffs.length > 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to calculate diffs" },
      { status: 500 }
    );
  }
}
