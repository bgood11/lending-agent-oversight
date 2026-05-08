import { ArDetail } from "@/components/principal/ar-detail";

export const metadata = {
  title: "AR detail — Lending Agent Oversight",
};

export default async function ArDetailPage({
  params,
}: {
  params: Promise<{ arId: string }>;
}) {
  const { arId } = await params;
  return <ArDetail arId={arId} />;
}
