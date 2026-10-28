import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { policyHtml } from "@/lib/shop-model";
import { loadShop } from "@/lib/storely";

export const metadata: Metadata = { title: "מדיניות" };

export default async function PolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await loadShop((await headers()).get("host"));
  const policy = shop.policies.find((item) => item.id === id);
  if (!policy) notFound();
  return (
    <article style={{ padding: "clamp(120px,14vh,160px) clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(32px,4vw,48px)" }}>{policy.title}</h1>
        <div className="policy-body" style={{ fontSize: 16, lineHeight: 1.75, color: "#3A3A3A" }} dangerouslySetInnerHTML={{ __html: policyHtml(policy.body) }} />
      </div>
    </article>
  );
}
