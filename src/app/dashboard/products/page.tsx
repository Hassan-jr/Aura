import { AddProductDialog } from "@/components/product/add-product-popover";
import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/actions/fetch.actions";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>
        <AddProductDialog />
      </div>
     
      <div className="w-96 flex flex-row gap-1">
        {products.map((productData, index) => (
          <ProductCard key={index} {...productData} />
        ))}
      </div>
    </main>
  );
}
