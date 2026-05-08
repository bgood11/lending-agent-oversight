import { AnnualReviewPacket } from "@/components/principal/annual-review-packet";

export const metadata = {
  title: "Annual fitness review — Lending Agent Oversight",
};

export default async function AnnualReviewPage({
  params,
}: {
  params: Promise<{ arId: string }>;
}) {
  const { arId } = await params;
  return <AnnualReviewPacket arId={arId} />;
}
