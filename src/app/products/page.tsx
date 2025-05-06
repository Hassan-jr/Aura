"use client";
import { AddProductDialog } from "@/components/product/add-product-popover";
import ProductCard from "@/components/product/product-card";
import { selectProducts } from "@/redux/slices/product";
import { useAppSelector } from "@/redux/hooks";
import Navheader from "@/customui/navheader";

export default function Home() {
  const products = useAppSelector(selectProducts);

  return (
    <Navheader>
      <main className="p-2">
        <div className="w-full flex flex-row justify-between align-middle mb-5">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <AddProductDialog />
        </div>

        <div className="w-96 flex flex-row gap-1">
          {products.map((productData, index) => (
            <ProductCard key={index} {...productData} />
          ))}
        </div>
      </main>
    </Navheader>
  );
}
