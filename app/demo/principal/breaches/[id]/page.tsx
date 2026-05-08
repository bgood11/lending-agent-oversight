import { BreachDetail } from "@/components/principal/breach-detail";

export const metadata = {
  title: "Breach detail — Lending Agent Oversight",
};

export default async function BreachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BreachDetail breachId={id} />;
}
