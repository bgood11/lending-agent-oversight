import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "lending-agent-oversight",
    version: "0.1.0",
    family: "lending-agent",
    siblings: [
      "https://lending-agent.vercel.app",
      "https://lending-agent-presenter.vercel.app",
    ],
    builtAt: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "main",
  });
}
