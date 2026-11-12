import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product";
import { findShopProduct, productPath } from "@/lib/shop-model";
import { loadShop } from "@/lib/storely";

type PageProps = { params: Promise<{ slug: string }> };

async function loadProduct(slug: string) {
  const shop = await loadShop((await headers()).get("host"));
  return { shop, product: findShopProduct(shop.products, slug) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { shop, product } = await loadProduct(slug);
  if (!product) return { title: "מוצר" };
  const description = product.short.trim();
  return {
    title: product.name,
    ...(description ? { description } : {}),
    alternates: { canonical: productPath(product, shop.products) },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { product } = await loadProduct(slug);
  if (!product) notFound();
  return <ProductPage />;
}
