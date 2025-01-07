'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { createAgent } from '@/actions/createAgent.action'
import { fetchAgent } from '@/utils/fetchAgent'
import { useSession } from "next-auth/react";
import { getProducts } from '@/utils/fetch'

export default function AnalysisComponent() {
const { data: session } = useSession();
  const [open, setOpen] = useState(false)
  const [queryType, setQueryType] = useState('product')
  const [customQuery, setCustomQuery] = useState('')
  const [runs, setRuns] = useState([])
  const { toast } = useToast()
  const userId = session?.user.id

  const productTitle = 'iPhone 15' // This would come from your product JSON

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const fetchedRuns = await fetchAgent(userId)
        setRuns(fetchedRuns)
      } catch (error) {
        console.error('Error loading runs:', error)
        toast({
          title: 'Error',
          description: 'Failed to load previous runs',
          variant: 'destructive',
        })
      }
    }
    loadRuns()
  }, [userId, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const query = queryType === 'product' ? productTitle : customQuery
    if (!query) {
      toast({
        title: 'Error',
        description: 'Please enter a query',
        variant: 'destructive',
      })
      return
    }

    try {

    //   const products= await getProducts()
      const productId = "675d535a0e36e390469f0a17" //products[0]._id.toString()
      const result = await createAgent(query, userId, productId)
      toast({
        title: 'Success',
        description: `Run created with ID: ${result.mongodbId}`,
      })
      setOpen(false)
      // Refresh the runs list
      const updatedRuns = await fetchAgent(userId)
      setRuns(updatedRuns)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create run',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Previous Runs On Social Media and S.E.O Analysis {userId}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='bg-black text-white'>Make a new run</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Run</DialogTitle>
              <DialogDescription>
                Choose a query type and enter your query to start a new analysis run.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <RadioGroup defaultValue="product" onValueChange={(value) => setQueryType(value as 'product' | 'custom')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">Use product as query</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Use custom query</Label>
                  </div>
                </RadioGroup>
                {queryType === 'product' ? (
                  <div className="flex flex-col justify-start gap-1 mt-10">
                    <Label htmlFor="productTitle" className="">
                      Product Title
                    </Label>
                    <Input id="productTitle" value={productTitle} className="col-span-3" disabled />
                  </div>
                ) : (
                  <div className="flex flex-col justify-start gap-1 mt-10">
                    <Label htmlFor="customQuery" className="">
                      Custom Query Tile
                    </Label>
                    <Input
                      id="customQuery"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button  className='bg-black text-white' type="submit">Run Analysis</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {runs.map((run) => (
          <div key={run._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{run.title}</h2>
            <p>Status: {run.status}</p>
            <p>Created at: {new Date(run.createdAt).toLocaleString()}</p>
            {run.status === 'completed' && (
              <div>
                <h3 className="text-lg font-semibold mt-2">Key Phrases:</h3>
                <ul className="list-disc pl-5">
                  {run.keyPhrases.map((phrase, index) => (
                    <li key={index}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

