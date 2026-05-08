import { NextRequest, NextResponse } from "next/server";
import { getArById, getBreachesForAr, getReviewsForAr, getMIReturnsForAr } from "@/lib/fixtures";
import { isValidSkinId } from "@/lib/skins";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ arId: string }> },
) {
  const { arId } = await params;
  const { searchParams } = new URL(request.url);
  const skin = searchParams.get("skin") ?? "heritage";

  if (!isValidSkinId(skin)) {
    return NextResponse.json(
      { error: { code: "invalid_skin", message: `Unknown skin '${skin}'.` } },
      { status: 400 },
    );
  }

  const ar = getArById(skin, arId);
  if (!ar) {
    return NextResponse.json(
      { error: { code: "not_found", message: `AR '${arId}' not found.` } },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ar,
    breaches: getBreachesForAr(skin, arId),
    reviews: getReviewsForAr(skin, arId),
    miReturns: getMIReturnsForAr(skin, arId),
  });
}
