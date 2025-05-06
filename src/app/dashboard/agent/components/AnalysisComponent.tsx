"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { createAgent } from "@/actions/createAgent.action";
import { fetchAgent } from "@/utils/fetchAgent";
import { useSession } from "next-auth/react";
import { RunDisplay } from "./RunDisplay";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { Card } from "@/components/ui/card";
import { selectProducts } from "@/redux/slices/product";
import { selectagents } from "@/redux/slices/agent";

export default function AnalysisComponent({ products }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [queryType, setQueryType] = useState("product");
  const [customQuery, setCustomQuery] = useState("");
  const runs = useAppSelector(selectagents);
  
  const { toast } = useToast();

  const userId = session?.user.id;

  const productId = useAppSelector(selectProductId);
  // const products2 = useAppSelector(selectProducts);
  const productTitle = products.find(
    (product) => product._id == productId
  )?.title;

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const query = queryType === "product" ? productTitle : customQuery;
    if (!query) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createAgent(query, userId, productId);
      toast({
        title: "Success",
        description: `Run created with ID: ${result.mongodbId}`,
      });
      setOpen(false);
      // Refresh the runs list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create run",
        variant: "destructive",
      });
    }
  };

  const [productAgentRuns, setproductAgentRuns] = useState([]);

  useEffect(() => {
    const filteredPosts = runs?.filter((run) => run.productId == productId);
    setproductAgentRuns(filteredPosts);
  }, [productId, runs]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Social Media and S.E.O Analysis Agent
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-slate-500">
              Make a new run
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Run</DialogTitle>
              <DialogDescription>
                Choose a query type and enter your query to start a new analysis
                run.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <RadioGroup
                  defaultValue="product"
                  onValueChange={(value) =>
                    setQueryType(value as "product" | "custom")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">Use product title as query</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Use custom query</Label>
                  </div>
                </RadioGroup>
                {queryType === "product" ? (
                  <div className="grid grid-cols-1 items-center gap-1 mt-4">
                    <Label htmlFor="productTitle" className="text-left">
                      Product
                    </Label>
                    <Input
                      id="productTitle"
                      value={productTitle}
                      className="col-span-3"
                      disabled
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 items-center gap-1 mt-4">
                    <Label htmlFor="customQuery" className="text-left">
                      Custom Query
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
                <Button
                  className="bg-black text-white hover:bg-slate-500"
                  type="submit"
                >
                  Start Analysis
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {productAgentRuns.map((run) => (
          <RunDisplay key={run._id} run={run} />
        ))}
      </div>

      {productAgentRuns.length == 0 && (
        <Card className="p-5 w-64 mx-auto">
          No Agentic Runs for this product
        </Card>
      )}
    </div>
  );
}
