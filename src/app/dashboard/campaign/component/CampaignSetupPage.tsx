"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCampaigns } from "@/actions/campaign.action";
import { CampaignSetupDialog } from "./CampaignSetupDialog";
import AnalysisComponent from "@/app/dashboard/agent/components/AnalysisComponent";

export function CampaignSetupPage({ userId, feedbacks, runs }) {
  const [campaigns, setCampaigns] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  console.log("campaigns: ", campaigns);

  const loadCampaigns = async () => {
    try {
      const fetchedCampaigns = await fetchCampaigns(userId);
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaign Setup</h1>
        <Button
          className="bg-black text-white hover:bg-slate-500"
          onClick={() => setIsDialogOpen(true)}
        >
          Setup a new campaign
        </Button>
      </div>

      {/* <AnalysisComponent /> */}

      <h2 className="text-xl font-semibold mt-8 mb-4">Previous Campaigns</h2>
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">{campaign.runId.title}</h3>
            <p>Frequency: {campaign.frequency}</p>
            <p>
              Scheduled: {new Date(campaign.scheduledTime).toLocaleString()}
            </p>
            <div className="mb-4">
              <h3 className="text-blue-400 mb-2">Sentiment Class:</h3>
              <pre> Polarity: {JSON.stringify(campaign.sentimentClass.polarity, null, 2)}</pre>
              <pre> Emotion: {JSON.stringify(campaign.sentimentClass.emotion, null, 2)}</pre>
              <pre> Rating: {JSON.stringify(campaign.sentimentClass.rating, null, 2)}</pre>
            </div>
            <p>Output: {campaign.outputType}</p>
            <p>
              Sites:{" "}
              {Object.entries(campaign.publishSites)
                .filter(([_, value]) => value)
                .map(([key]) => key)
                .join(", ")}
            </p>
          </div>
        ))}
      </div>

      <CampaignSetupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={userId}
        onCampaignCreated={loadCampaigns}
        feedbacks={feedbacks}
        runs={runs}
      />
    </div>
  );
}
