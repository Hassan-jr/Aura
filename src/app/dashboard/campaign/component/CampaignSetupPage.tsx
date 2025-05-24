"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toast as toast2 } from "react-toastify";
import {
  deleteCampaign,
  editCampaign,
  fetchCampaigns,
} from "@/actions/campaign.action";
import { CampaignSetupDialog } from "./CampaignSetupDialog";
import AnalysisComponent from "@/app/dashboard/agent/components/AnalysisComponent";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { Card } from "@/components/ui/card";
import { selectcampaigns, setcampaigns } from "@/redux/slices/campagin";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { CampaignEditDialog } from "./EditCampaignDialog";
import { Divide, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setcampaignResults } from "@/redux/slices/campaginResult";
import { getCampaignResult } from "@/actions/campaginResult.action";

export function CampaignSetupPage({ userId, feedbacks, runs }) {
  const productId = useAppSelector(selectProductId);
  const campaigns = useAppSelector(selectcampaigns);
  const [productCampagins, setproductCampagins] = useState([]);
  // const [campaigns, setCampaigns] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const loadCampaginResult = async () => {
    try {
      const results = await getCampaignResult(userId);
      dispatch(setcampaignResults(results));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns Results",
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

  const [selectedCampagin, setSelectedCampagin] = useState(null);
  const handleIsEditDialogOpen = (state, id) => {
    setIsEditDialogOpen(state);
    setSelectedCampagin(id);
  };

  // status
  const handleActiveStatus = async (status, id) => {
    try {
      const campaignData = {
        isActive: status,
      };
      await editCampaign(id, campaignData);
      toast({
        title: "Success",
        description: "Campaign Status Updated Successfully",
      });
      loadCampaigns();
    } catch (error) {
      toast({
        title: "error",
        description: "An Error Occurred",
      });
    }
  };

  // delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  // delete comapgn
  const deleteCampagin = async (id) => {
    try {
      await deleteCampaign(id);
      toast({
        title: "Success",
        description: "Campaign Deleted Successfully",
      });
      loadCampaigns();
    } catch (error) {
      toast({
        title: "error",
        description: "An Error Occurred",
      });
    }
  };

  // run campagin Manually
  interface RunResult {
    success: boolean;
    status: number;
    message?: string;
    error?: string;
  }

  async function runCampaignsManually(campId) {
    const url =
      process.env.NODE_ENV == "development"
        ? "/"
        : process.env.NEXT_PUBLIC_APP_URL;
    const API_ENDPOINT = `${url}api/automation`;
    const API_SECRET = process.env.ATLAS_TRIGGER_SECRET ?? "416TriggerKEY123";
    const id = toast2.loading("Running Campaign Manually....");

    const payload = campaigns.find((camp) => camp._id == campId);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Trigger-Secret": API_SECRET,
        },
        body: JSON.stringify(payload),
      });

      // Always capture the HTTP status
      const status = await response.json();
      if (status?.success) {
        toast2.update(id, {
          render: "Campagin Runned Successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        await loadCampaginResult();
      } else {
        toast2.update(id, {
          render: "Campagin Endpoint Retruned an Error",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (err: any) {
      toast2.update(id, {
        render: "An Error Occurred",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      console.log("Error:", err);
    }
  }

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
                <Button
                  className="bg-black text-white hover:bg-slate-500"
                  onClick={() => runCampaignsManually(campaign._id)}
                >
                  Run Now
                </Button>
                <Button
                  className="bg-yellow-500 text-white hover:bg-slate-500"
                  onClick={() => handleIsEditDialogOpen(true, campaign._id)}
                >
                  Edit Campagin
                </Button>
                {/* <Button
                  className="bg-red-500 text-white hover:bg-slate-500"
                  onClick={() => deleteCampagin(campaign._id)}
                >
                  Delete Campagin
                </Button> */}

                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Campaign</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this campaign? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteCampagin(campaign._id)}
                      >
                        Delete Campaign
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <p>Campagin Status</p>
              </div>
              <div>
                <Switch
                  className="data-[state=checked]:bg-blue-600"
                  checked={campaign.isActive}
                  onCheckedChange={() =>
                    handleActiveStatus(!campaign.isActive, campaign._id)
                  }
                />
              </div>
            </div>
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

      {selectedCampagin && (
        <CampaignEditDialog
          CampaignId={selectedCampagin}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userId={userId}
          onCampaignCreated={loadCampaigns}
          feedbacks={feedbacks}
          runs={runs}
        />
      )}
    </div>
  );
}
