"use client";

import { useState } from "react";
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
import { createCampaign } from "@/actions/campaign.action";
import { Card } from "@/components/ui/card";
import { FilterComponent } from "@/components/sentiment/component/FilterComponent";
import { RunDisplay } from "../../agent/components/RunDisplay";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

export function CampaignSetupDialog({
  open,
  onOpenChange,
  userId,
  onCampaignCreated,
  feedbacks,
  runs,
}) {
  const [runId, setRunId] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [scheduledTime, setScheduledTime] = useState("");
  const [outputType, setOutputType] = useState("photos");
  const [numberOfPhotos, setNumberOfPhotos] = useState(4);
  const [publishSites, setPublishSites] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    emailMarketing: false,
  });
  const { toast } = useToast();

  const [sentimentClass, setSentimentClass] = useState({
    polarity: [],
    emotion: [],
    rating: [],
  });

  const [checked, setChecked] = useState(false);

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    // onToggle(checked)
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const campaignData = {
      sentimentClass,
      newRun: checked,
      productId: feedbacks[0].productId,
      userId,
      runId,
      frequency,
      scheduledTime: frequency === "now" ? new Date() : new Date(scheduledTime),
      outputType,
      numberOfPhotos,
      publishSites,
    };

    console.log("campaignData:", campaignData);
    const result = await createCampaign(campaignData);
    if (result.success) {
      toast({
        title: "Success",
        description: "Campaign created successfully",
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


  // Function to get the selected run
  const getSelectedRun = () => runs.find((run) => run._id === runId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-2 max-h-[100vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Setup a New Campaign</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto relative"
        >
          <Card className="container mx-auto p-4">
            <FilterComponent
              data={feedbacks}
              setFilteredFeedbacks={setFilteredFeedbacks}
              setSentimentClass={setSentimentClass}
            />
          </Card>

          <Select2.Root value={runId} onValueChange={setRunId}>
            <Select2.Trigger className=" w-full mx-auto inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
              <Select2.Value
                placeholder="Select from previous S.E.O Agent Runs"
                className="w-full m-1 space-y-4"
              >
                <RunDisplay run={getSelectedRun()} />
              </Select2.Value>
            </Select2.Trigger>

            <Select2.Portal>
              <Select2.Content className="relative w-auto mx-auto overflow-hidden rounded-md bg-white shadow-lg z-50">
                <Select2.ScrollUpButton className="flex items-center justify-center h-[25px] w-full bg-white text-gray-700 cursor-default">
                  <ChevronUp className="h-4 w-4" />
                </Select2.ScrollUpButton>
                <Select2.Viewport className="p-2 w-full">
                  {runs.map((run) => (
                    <Select2.Item
                      key={run._id}
                      value={run._id}
                      className="relative flex justify-center align-middle mx-auto items-center  rounded-md text-sm text-gray-700 hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none select-none z-50"
                    >
                      <Select2.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </Select2.ItemIndicator>

                      <RunDisplay run={run} />

                      <Select2.ItemText></Select2.ItemText>
                    </Select2.Item>
                  ))}
                </Select2.Viewport>

                <Select2.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                  <ChevronDown className="h-4 w-4" />
                </Select2.ScrollDownButton>
              </Select2.Content>
            </Select2.Portal>
          </Select2.Root>

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
              Make a new run every time
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
                <SelectItem value="now">Now</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency !== "now" && (
            <div>
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
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
            <Label>Publish Sites</Label>
            <div className="space-y-2">
              {Object.entries(publishSites).map(([site, checked]) => (
                <div key={site} className="flex items-center space-x-2">
                  <Checkbox
                    id={site}
                    checked={checked}
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
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
