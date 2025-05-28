"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Select2 from "@radix-ui/react-select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { createCampaign, editCampaign } from "@/actions/campaign.action";
import { Card } from "@/components/ui/card";
import { FilterComponent } from "@/components/sentiment/component/FilterComponent";
import { useAppSelector } from "@/redux/hooks";
import { selectcampaigns } from "@/redux/slices/campagin";

export function CampaignEditDialog({
  CampaignId,
  open,
  onOpenChange,
  userId,
  onCampaignCreated,
  feedbacks,
  runs,
}) {
  function formatToYYYYMMDDHHmm(isoString) {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const campaigns = useAppSelector(selectcampaigns);
  const [Campaigndata, setCampaigndata] = useState(
    campaigns?.find((camp) => camp._id == CampaignId)
  );

  useEffect(() => {
    setCampaigndata(campaigns?.find((camp) => camp._id == CampaignId));
  }, [CampaignId]);

  const productId = Campaigndata?.productId;
  const [productSentiments, setproductSentiments] = useState([]);

  const [title, setTitle] = useState(Campaigndata?.title);
  const [runId, setRunId] = useState("");
  const [frequency, setFrequency] = useState(Campaigndata?.frequency);
  const [scheduledTime, setScheduledTime] = useState(
    formatToYYYYMMDDHHmm(Campaigndata?.scheduledTime)
  );
  const [outputType, setOutputType] = useState(Campaigndata?.outputType);
  const [numberOfPhotos, setNumberOfPhotos] = useState(
    Campaigndata?.numberOfPhotos
  );
  const [publishSites, setPublishSites] = useState({
    emailMarketing: Campaigndata?.publishSites.emailMarketing
      ? Campaigndata?.publishSites?.emailMarketing
      : false,
  });
  const { toast } = useToast();

  const [sentimentClass, setSentimentClass] = useState(
    Campaigndata?.sentimentClass
  );

  const [checked, setChecked] = useState(Campaigndata?.newRun);

  const handleTitleChange = (e) => {
    e.preventDefault();

    setTitle(e.target.value);
  };
  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    // onToggle(checked)
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const campaignData2 = {
      title,
      sentimentClass,
      newRun: checked,
      productId: productId,
      userId,
      runId,
      frequency,
      scheduledTime: frequency === "now" ? new Date() : new Date(scheduledTime),
      outputType,
      numberOfPhotos,
      publishSites,
    };
    const result = await editCampaign(Campaigndata._id, campaignData2);
    if (result.success) {
      toast({
        title: "Success",
        description: "Campaign Edit successfully",
      });
      onCampaignCreated();
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const [filteredFeedbacks, setFilteredFeedbacks] = useState(feedbacks);

  useEffect(() => {
    const filteredPosts = feedbacks?.filter(
      (feedback) => feedback.productId == productId
    );
    setproductSentiments(filteredPosts);
    setFilteredFeedbacks(filteredPosts);
  }, [productId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-2 max-h-[100vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto relative"
        >
          <div>
            <Label
              htmlFor="campaign-title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Campagin Title
            </Label>
            <Input
              id="campaign-title"
              type="text"
              placeholder="Campagin Title"
              value={title}
              onChange={handleTitleChange}
              className="mx-1"
              required={true}
            />
          </div>
          <Card className="container mx-auto p-4">
            <h1 className="text-xl font-bold ml-[-10px] mb-1 text-blue-700">
              Select Sentiment Class
            </h1>
            <FilterComponent
              data={productSentiments}
              setFilteredFeedbacks={setFilteredFeedbacks}
              setSentimentClass={setSentimentClass}
            />
          </Card>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-run"
              checked={checked}
              onCheckedChange={handleCheckedChange}
            />
            <Label
              htmlFor="new-run"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Run a new S.E.O & SM Analysis Agent Everytime
            </Label>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency !== "now" && (
            <div>
              <Label htmlFor="scheduledTime">Start Date</Label>
              <Input
                type="datetime-local"
                id="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="outputType">Campaign Output</Label>
            <Select value={outputType} onValueChange={setOutputType}>
              <SelectTrigger>
                <SelectValue placeholder="Select output type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photos">Photos</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {outputType !== "videos" && (
            <div>
              <Label htmlFor="numberOfPhotos">Number of Photos</Label>
              <Select
                value={numberOfPhotos.toString()}
                onValueChange={(value) => setNumberOfPhotos(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of photos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Enable Email Notification</Label>
            <div className="space-y-2">
              {publishSites &&
                Object.entries(publishSites)?.map(([site, checked]) => (
                  <div key={site} className="flex items-center space-x-2">
                    <Checkbox
                      id={site}
                      checked={Boolean(checked)}
                      onCheckedChange={(value) =>
                        setPublishSites((prev) => ({ ...prev, [site]: value }))
                      }
                    />
                    <Label htmlFor={site}>
                      {site.charAt(0).toUpperCase() + site.slice(1)}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <Button
            className="bg-black text-white hover:bg-slate-500 w-full"
            type="submit"
          >
            Save Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
