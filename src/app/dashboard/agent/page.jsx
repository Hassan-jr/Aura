
"use client"
import AnalysisComponent from './components/AnalysisComponent'
import { selectProducts } from "@/redux/slices/product";
import { useAppSelector } from "@/redux/hooks";

export default function Page() {
  
  return (
    <main className="container mx-auto p-4">
      
        <AnalysisComponent/>
      
    </main>
  )
}

