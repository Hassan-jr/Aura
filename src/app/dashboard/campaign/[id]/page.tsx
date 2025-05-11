"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/redux/hooks";
import { selectgenerations } from "@/redux/slices/generate";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { selectloras } from "@/redux/slices/lora";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { selectcampaignResults } from "@/redux/slices/campaginResult";
import { selectfeedbacks } from "@/redux/slices/feeback";
import { selectagents } from "@/redux/slices/agent";
import CampaignResultCard from "./campaign-results-card";

function Home() {
  const params = useParams();
 
  const campaignResults = useAppSelector(selectcampaignResults);

  const id = params?.id;

  return (
    <div>
      <Card className="mb-4 overflow-hidden">
        <div className="flex">
          <CardContent className="w-full p-2 flex flex-col">
            {campaignResults.map((result) => (
              <CampaignResultCard key={result._id} result={result} />
            ))}
          </CardContent>
        </div>
      </Card>

    
    </div>
  );
}

export default Home;
