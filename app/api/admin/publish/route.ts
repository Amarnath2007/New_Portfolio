import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import {
  getDraftPortfolioData,
  getPublishedPortfolioData,
  validatePortfolioData,
  computeDiff,
} from "@/lib/portfolio-data";

const execAsync = promisify(exec);

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
    const draft = getDraftPortfolioData();
    const published = getPublishedPortfolioData();

    // 1. Validation
    const validation = validatePortfolioData(draft);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Content validation failed", errors: validation.errors },
        { status: 422 }
      );
    }

    // 2. Diff report before overwriting
    const diffs = computeDiff(draft, published);

    // 3. Overwrite published file with draft content
    const dataDir = path.join(process.cwd(), "data");
    const publishedFile = path.join(dataDir, "portfolio-published.json");
    fs.writeFileSync(publishedFile, JSON.stringify(draft, null, 2), "utf-8");

    // 4. Git-based Deployment to live Vercel
    let gitStatus = "unknown";
    let gitMessage = "";
    let gitOutput = "";
    let deploymentTriggered = false;

    try {
      // Stage only explicit published content and uploaded assets (with -A for deletions)
      await execAsync('git add -A "data/portfolio-published.json"');

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(uploadsDir)) {
        await execAsync('git add -A "public/uploads"');
      }

      // Check if there are staged changes
      const { stdout: diffStdout } = await execAsync("git diff --staged --name-only");

      if (diffStdout.trim().length > 0) {
        const commitMsg = "chore(portfolio): publish updates via local admin dashboard";
        await execAsync(`git commit -m "${commitMsg}"`);

        // Attempt push to remote origin
        try {
          const { stdout: pushStdout } = await execAsync("git push origin main");
          gitStatus = "pushed_to_remote";
          deploymentTriggered = true;
          gitMessage = "Published and pushed to GitHub main! Live Vercel deployment triggered automatically.";
          gitOutput = pushStdout;
        } catch (pushErr: any) {
          gitStatus = "committed_locally";
          gitMessage = "Changes saved and committed locally. Automated push requires manual push or credentials.";
          gitOutput = pushErr?.message || String(pushErr);
        }
      } else {
        gitStatus = "already_up_to_date";
        gitMessage = "Portfolio content is already up-to-date with repository.";
      }
    } catch (gitErr: any) {
      console.warn("Git workflow warning:", gitErr);
      gitStatus = "git_skipped";
      gitMessage = "Changes saved to published portfolio files. Git operations can be run manually if needed.";
      gitOutput = gitErr?.message || String(gitErr);
    }

    return NextResponse.json({
      success: true,
      message: gitMessage || "Portfolio published successfully!",
      diffsCount: diffs.length,
      deploymentTriggered,
      gitStatus,
      gitOutput: gitOutput ? gitOutput.substring(0, 300) : "",
      gitInstruction: deploymentTriggered ? null : "git push origin main",
    });
  } catch (error: any) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to publish portfolio" },
      { status: 500 }
    );
  }
}
