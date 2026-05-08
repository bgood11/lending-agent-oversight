import { FileReviewDetail } from "@/components/principal/file-review-detail";

export const metadata = {
  title: "File review — Lending Agent Oversight",
};

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FileReviewDetail reviewId={id} />;
}
