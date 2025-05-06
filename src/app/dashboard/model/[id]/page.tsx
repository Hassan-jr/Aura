"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/redux/hooks";
import { selectgenerations } from "@/redux/slices/generate";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { selectloras } from "@/redux/slices/lora";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Link, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurFadeDemo from "./images";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Training":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Training
        </Badge>
      );
    case "success":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

function Home() {
  const params = useParams();
  const lorasData = useAppSelector(selectloras);
  const generationData = useAppSelector(selectgenerations);
  const id = params?.id;

  const [currentLora, setCurrentLora] = useState(
    lorasData.find((lora) => lora._id == id)
  );
  const [currentProductGens, setCurrentProductGens] = useState(
    generationData?.filter((gen) => gen.lora_url == currentLora?.loraPath)
  );

  useEffect(() => {
    if (id && lorasData?.length > 0) {
      setCurrentLora(lorasData.find((lora) => lora?._id == id));
    }
  }, [id, lorasData]);

  useEffect(() => {
    if (id && currentLora) {
      setCurrentProductGens(
        generationData.filter((gen) => gen.lora_url == currentLora.loraPath)
      );
    }
  }, [id, currentLora]);

  // training image urls
  const [trainUrls, setTrainUrls] = useState([]);
  const [genUrls, setGenUrls] = useState([]);

  useEffect(() => {
    if (currentLora) {
      const urls = currentLora?.trainImgs?.map((lora) => lora.imgUrl);
      setTrainUrls(urls);
    }
  }, [currentLora]);

  useEffect(() => {
    if (currentProductGens?.length > 0) {
      const nested = currentProductGens.map((gen) =>
        gen.generations.map((gen2) =>
          gen2.images.map((image) => `https://r2.nomapos.com/${image.url}`)
        )
      );

      const urls = nested.flat(2);
      setGenUrls(urls);
    }
  }, [currentProductGens]);
  return (
    <div>
      <Card className="mb-4 overflow-hidden">
        <div className="flex">
          <CardContent className="w-2/3 p-2 flex flex-col">
            <div className="flex gap-2 items-start mb-1">
              <h3 className="text-xl font-bold">
                {currentLora?.characterName}
              </h3>
              <StatusBadge status={currentLora?.status} />
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              Token: <span className="font-mono">{currentLora?.tokenName}</span>
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
              <div>
                <p className="text-xs text-muted-foreground">Batch Size</p>
                <p className="font-medium">{currentLora?.batch_size}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Steps</p>
                <p className="font-medium">{currentLora?.steps}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Optimizer</p>
                <p className="font-medium">{currentLora?.optimizer}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Learning Rate</p>
                <p className="font-medium">{currentLora?.lr}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dropout Rate</p>
                <p className="font-medium">
                  {currentLora?.caption_dropout_rate}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quantize</p>
                <p className="font-medium">
                  {currentLora?.quantize ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="mt-1 flex flex-row justify-start align-middle gap-1">
              <a href={currentLora?.loraPath} target="_blank">
                <Button className="text bg-blue-600 hover:bg-blue-500">
                  Download Model
                </Button>
              </a>
            </div>
          </CardContent>
        </div>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Product Training Images</TabsTrigger>
          <TabsTrigger value="discounts">Product Generated Images</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <BlurFadeDemo images={trainUrls} />
        </TabsContent>
        <TabsContent value="discounts">
          <BlurFadeDemo images={genUrls} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Home;
