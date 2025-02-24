'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SearchResult } from './SearchResult'
import { FeatureExtraction } from './FeatureExtraction'
import { AnalysisReport } from './AnalysisReport'


export function RunDisplay({ run  }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="text-xl font-semibold">{run?.title}</h2>
          <p className="text-sm text-gray-500">Status: {run?.status}</p>
          <p className="text-sm text-gray-500">Created: {new Date(run?.createdAt).toLocaleString()}</p>
        </div>
        {/* <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button> */}
      </div>
      {/* {isOpen && ( */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger className="px-4 z-[999]">View Details</AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="data-extraction" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data-extraction">Data Extraction</TabsTrigger>
                  <TabsTrigger value="feature-extraction">Feature Extraction</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="data-extraction">
                  <div className="space-y-4 p-4">
                    {run?.results?.results.map((result, index) => (
                      <SearchResult key={index} result={result} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="feature-extraction">
                  <FeatureExtraction
                    hashtags={run?.analysis?.hashtags}
                    keySellingPoints={run?.analysis?.content_ideas}
                    keyPhrases={run?.keyPhrases}
                  />
                </TabsContent>
                <TabsContent value="analysis">
                  <AnalysisReport report={run?.analysis?.report} run={run} />
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      {/* )} */}
    </div>
  )
}

