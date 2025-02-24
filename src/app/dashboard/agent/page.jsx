
import { Suspense } from 'react'
import AnalysisComponent from './components/AnalysisComponent'
import { getProducts } from "@/actions/fetch.actions";

export default async function Page() {
  const products = await getProducts();
  return (
    <main className="container mx-auto p-4">
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <AnalysisComponent products={products} />
      {/* </Suspense> */}
    </main>
  )
}

