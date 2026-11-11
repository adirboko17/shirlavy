import Link from "next/link";
import { CommerceIcon } from "@/components/commerce-icon";

export default function ProductNotFound() {
  return (
    <section className="commerce product-missing">
      <CommerceIcon name="bag" width="42" height="42" />
      <h1>המוצר לא נמצא</h1>
      <Link href="/shop" className="commerce-text-link">חזרה לחנות <CommerceIcon name="arrow" /></Link>
    </section>
  );
}
