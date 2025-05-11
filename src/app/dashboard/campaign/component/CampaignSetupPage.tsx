"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCampaigns } from "@/actions/campaign.action";
import { CampaignSetupDialog } from "./CampaignSetupDialog";
import AnalysisComponent from "@/app/dashboard/agent/components/AnalysisComponent";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { Card } from "@/components/ui/card";
import { selectcampaigns, setcampaigns } from "@/redux/slices/campagin";
import { useDispatch } from "react-redux";
import Link from "next/link";

export function CampaignSetupPage({ userId, feedbacks, runs }) {
  const productId = useAppSelector(selectProductId);
  const campaigns = useAppSelector(selectcampaigns);
  const [productCampagins, setproductCampagins] = useState([]);
  // const [campaigns, setCampaigns] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const loadCampaigns = async () => {
    try {
      const fetchedCampaigns = await fetchCampaigns(userId);
      dispatch(setcampaigns(fetchedCampaigns));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const filteredPosts = campaigns?.filter(
      (dis) => dis.productId == productId
    );
    setproductCampagins(filteredPosts);
  }, [productId, campaigns]);

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
        {productCampagins.map((campaign) => (
          <div key={campaign._id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex flex-row flex-wrap justify-between align-middle">
              <h3 className="font-semibold mb-4">{campaign.title}</h3>
              <div className="flex flex-row gap-1">
                <Button className="bg-black text-white hover:bg-slate-500">
                  Run Now
                </Button>
                <Button className="bg-yellow-500 text-white hover:bg-slate-500">
                  Edit Campagin
                </Button>
                <Button className="bg-red-500 text-white hover:bg-slate-500">
                  Delete Campagin
                </Button>

                <Link href={`campaign/${campaign._id}`}>
                  <Button className="bg-green-500 text-white hover:bg-slate-500">
                    View Campagin Results
                  </Button>
                </Link>
              </div>
            </div>

            <table className="w-full mb-4 border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Frequency
                  </td>
                  <td className="py-2 px-4">{campaign.frequency}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Scheduled
                  </td>
                  <td className="py-2 px-4">
                    {new Date(campaign.scheduledTime).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Vision Model Outputs
                  </td>
                  <td className="py-2 px-4">{campaign.outputType}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Sites
                  </td>
                  <td className="py-2 px-4">
                    {Object.entries(campaign.publishSites)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(", ")}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Polarity
                  </td>
                  <td className="py-2 px-4">
                    <pre className="inline">
                      {campaign?.sentimentClass?.polarity
                        ?.map(
                          (star) =>
                            ({
                              "1 star": "Highly Negative",
                              "2 stars": "Negative",
                              "3 stars": "Neutral",
                              "4 stars": "Positive",
                              "5 stars": "Highly Positive",
                            }[star] || star)
                        )
                        .join(", ")}
                    </pre>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Emotion
                  </td>
                  <td className="py-2 px-4">
                    <pre className="inline">
                      
                      {campaign?.sentimentClass?.emotion
                        ?.map(
                          (label) =>
                            ({
                              LABEL_0: "Sad",
                              LABEL_1: "Happy",
                              LABEL_2: "Love",
                              LABEL_3: "Angry",
                              LABEL_4: "Fearful",
                              LABEL_5: "Surprised",
                            }[label] || label)
                        )
                        .join(", ")}
                    </pre>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-600 border-r font-medium">
                    Rating
                  </td>
                  <td className="py-2 px-4">
                    <pre className="inline">
                      {/* {JSON.stringify(campaign.sentimentClass.rating, null, 2)} */}
                      {campaign?.sentimentClass?.rating
                        .map((rating) => `${rating}/5`)
                        .join(", ")}
                    </pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {productCampagins.length == 0 && (
        <Card className="p-5 w-72 mx-auto">
          No Campagins available for this product
        </Card>
      )}

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
