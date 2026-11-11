import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductPage } from "@/components/product";
import { findShopProduct, productPath, productSlug } from "@/lib/shop-model";
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
  const { shop, product } = await loadProduct(slug);
  if (!product) notFound();
  const canonical = productSlug(product, shop.products);
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    /* already decoded, or not valid percent-encoding */
  }
  if (decoded !== canonical) permanentRedirect(productPath(product, shop.products));
  return <ProductPage />;
}
