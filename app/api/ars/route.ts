import { NextRequest, NextResponse } from "next/server";
import { getArs } from "@/lib/fixtures";
import { isValidSkinId } from "@/lib/skins";

export const dynamic = "force-dynamic";

/**
 * GET /api/ars?skin=heritage&band=critical&page=1&pageSize=50
 *
 * Read-only listing of ARs for the requested skin. Demo wraps the
 * fixture set; production reads from Postgres with row-level security
 * enforced by tenant_id.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skin = searchParams.get("skin") ?? "heritage";
  const band = searchParams.get("band");
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 25)));

  if (!isValidSkinId(skin)) {
    return NextResponse.json(
      { error: { code: "invalid_skin", message: `Unknown skin '${skin}'.` } },
      { status: 400 },
    );
  }

  let items = getArs(skin);
  if (band) items = items.filter((a) => a.riskBand === band);
  if (status) items = items.filter((a) => a.status === status);

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  const nextCursor =
    start + pageSize < total ? `page=${page + 1}` : null;

  return NextResponse.json({
    items: paged,
    nextCursor,
    total,
  });
}
