
import { Suspense } from 'react'
import AnalysisComponent from './components/AnalysisComponent'

export default function Page() {
  return (
    <main className="container mx-auto p-4">
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <AnalysisComponent />
      {/* </Suspense> */}
    </main>
  )
}

