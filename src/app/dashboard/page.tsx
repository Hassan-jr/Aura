import ChartTEST from "@/components/charts/test";
import { auth } from "@/app/auth";
// import { useDispatch } from 'react-redux';


import { setProducts } from '@/redux/slices/product'; 


import { connect } from "@/db";
import {Product} from "@/modals/product.modal"



async function getProducts(id: string) {
    await connect();
    const products = await Product.find({ userId: id })
      .sort({ createdAt: +1 })
      .lean();
    const finalProducts = products.map((product)=>({
      ...product,
      _id: product._id.toString(), // Convert _id to string
      createdAt: product.createdAt.toISOString(), // Convert Date to ISO string
      updatedAt: product.updatedAt.toISOString(), // Convert Date to ISO string
    }))

    return finalProducts
  }


export default async function Page() {

// const dispatch = useDispatch()
//  const session = await auth();
//  const finalProducts = await getProducts(session?.user?.id)
//  dispatch(setProducts(finalProducts));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <ChartTEST />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
