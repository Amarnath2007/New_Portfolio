import { NextResponse } from "next/server";
import { getPublishedPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getPublishedPortfolioData();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
