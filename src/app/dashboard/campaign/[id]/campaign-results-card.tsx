"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/redux/hooks";
import { selectagents } from "@/redux/slices/agent";
import { selectcampaigns } from "@/redux/slices/campagin";
import { selectfeedbacks } from "@/redux/slices/feeback";
import { selectgenerations } from "@/redux/slices/generate";
import { selectloras } from "@/redux/slices/lora";
import { Calendar, CheckCircle, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import CampaignResult from "./campaingResult";
import { RunDisplay } from "../../agent/components/RunDisplay";
import { selectposts } from "@/redux/slices/post";
import PostsCardsComponent from "../../posts/postCard";
import PostCard from "@/components/posts/post-card";
import { selectProducts } from "@/redux/slices/product";
import BlurFadeDemo from "../../model/[id]/images";
import {
  EmotionLabel,
  PolarityLabel,
} from "@/components/sentiment/component/types";
import { SentimentTable } from "@/components/sentiment/sentimentTable";
import { selectusers } from "@/redux/slices/user";
import { selectProductId } from "@/redux/slices/productId";
import ProductCard from "@/components/product/product-card";

interface CampaignResultProps {
  result: {
    _id: string;
    userId: string;
    outputType: string;
    numberOfPhotos: number;
    productId: string;
    agentId: string;
    campaignId: string;
    generationId: string;
    postId: string;
    sentimentClass: {
      polarity: string[];
      emotion: string[];
      rating: number[];
    };
    publishSites: {
      facebook: boolean;
      instagram: boolean;
      twitter: boolean;
      emailMarketing: boolean;
    };
    createdAt: any;
    updatedAt: any;
  };
}

export default function CampaignResultCard({ result }: CampaignResultProps) {
  const [expanded, setExpanded] = useState(false);

  //   FETCH DATA
  const feedbacks = useAppSelector(selectfeedbacks);
  const fetchedRuns = useAppSelector(selectagents);
  const lorasData = useAppSelector(selectloras);
  const generationData = useAppSelector(selectgenerations);
  const campaigns = useAppSelector(selectcampaigns);
  const posts = useAppSelector(selectposts);
  const products = useAppSelector(selectProducts);
  const users = useAppSelector(selectusers);
  const productId = useAppSelector(selectProductId);

  //   state for manaing data
  const [resultcampaigns, setResultcampaigns] = useState(
    campaigns.find((camp) => camp._id == result.campaignId)
  );
  const [resultRun, setResultRun] = useState(
    fetchedRuns.find((run) => run._id == result.agentId)
  );
  const [runPost, setRunPost] = useState(
    posts.find((post) => post._id == result.postId)
  );

  const getImageUrls = (gens) => {
    const nested = gens?.generations?.map((gen2) =>
      gen2?.images?.map((image) => `https://r2.nomapos.com/${image.url}`)
    );
    const urls = nested?.flat(2);
    console.log("urls:", urls);

    return urls?.length > 0
      ? urls
      : ["https://r2.nomapos.com/CSC416/loadingImage.svg"];
  };
  const [resulGen, setResultGen] = useState(
    getImageUrls(generationData.find((gen) => gen._id == result.generationId))
  );

  const [resultFeedbacks, setResultFeedbacks] = useState(
    feedbacks.filter((item) => {
      const polarityMatch = result.sentimentClass.polarity?.map(
        (selectedPolarity) =>
          selectedPolarity.length === 0 ||
          selectedPolarity.includes(
            item.polarity.reduce((a, b) => (a.score > b.score ? a : b))
              .label as PolarityLabel
          )
      );
      const emotionMatch = result.sentimentClass.emotion?.map(
        (selectedEmotions) =>
          selectedEmotions.length === 0 ||
          selectedEmotions.includes(
            item.emotion.reduce((a, b) => (a.score > b.score ? a : b))
              .label as EmotionLabel
          )
      );
      const ratingMatch = result.sentimentClass.rating?.map(
        (selectedRatings) => selectedRatings == item.rating
      );
      return polarityMatch && emotionMatch && ratingMatch;
    })
  );

  const [resultProduct, setResultProduct] = useState(
    products.find((product) => product._id == result.productId)
  );

  useEffect(() => {
    setResultcampaigns(campaigns.find((camp) => camp._id == result.campaignId));
  }, [campaigns, result]);

  useEffect(() => {
    setResultRun(fetchedRuns.find((run) => run._id == result.agentId));
  }, [fetchedRuns, result]);

  useEffect(() => {
    setRunPost(posts.find((post) => post._id == result.postId));
  }, [posts, result]);

  useEffect(() => {
    setResultGen(
      getImageUrls(generationData.find((gen) => gen._id == result.generationId))
    );
  }, [generationData, result]);

  useEffect(() => {
    setResultFeedbacks(
      feedbacks.filter((item) => {
        const polarityMatch = result.sentimentClass.polarity?.map(
          (selectedPolarity) =>
            selectedPolarity.length === 0 ||
            selectedPolarity.includes(
              item.polarity.reduce((a, b) => (a.score > b.score ? a : b))
                .label as PolarityLabel
            )
        );
        const emotionMatch = result.sentimentClass.emotion?.map(
          (selectedEmotions) =>
            selectedEmotions.length === 0 ||
            selectedEmotions.includes(
              item.emotion.reduce((a, b) => (a.score > b.score ? a : b))
                .label as EmotionLabel
            )
        );
        const ratingMatch = result.sentimentClass.rating?.map(
          (selectedRatings) => selectedRatings == item.rating
        );
        return polarityMatch && emotionMatch && ratingMatch;
      })
    );
  }, [feedbacks, result]);

  useEffect(() => {
    setResultProduct(
      products.find((product) => product._id == result.productId)
    );
  }, [products, result]);

  return (
    <Card className="w-full overflow-hidden mb-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Campaign Result</CardTitle>
            <CardDescription>ID: {result._id}...</CardDescription>
          </div>
          <Button
            className={`${
              result?.generationId ? "bg-green-600" : "bg-orange-400"
            }`}
          >
            {result.generationId ? "Completed" : "Running..."}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created</span>
            </div>
            <span className="text-sm font-medium">{result?.createdAt}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Sentiment Class
              </span>
            </div>
            <span className="text-sm font-medium">
              <pre className="inline">
                {result?.sentimentClass?.polarity
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
                {", "}
                {result?.sentimentClass?.emotion
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
                {", "}
                {result?.sentimentClass?.rating
                  .map((rating) => `${rating}/5`)
                  .join(", ")}
              </pre>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Real Time Data Integration
              </span>
            </div>
            <div className="flex items-center"></div>
          </div>

          <Button
            onClick={() => setExpanded(!expanded)}
            className={`w-full rounded-md ${
              !expanded
                ? "bg-blue-600 hover:bg-blue-400"
                : "bg-blue-300 hover:hover:bg-blue-200"
            }  py-2 text-sm font-medium `}
          >
            {expanded ? "Show Less" : "Show More Details"}
          </Button>
          {expanded && (
            <>
              <Separator />

              <Tabs defaultValue="campaign" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="campaign">Campaign</TabsTrigger>
                  <TabsTrigger value="agent">
                    S.E.O & SM Analysis Agent
                  </TabsTrigger>
                  <TabsTrigger value="generation">
                    Generated Visuals
                  </TabsTrigger>
                  <TabsTrigger value="post">Post</TabsTrigger>

                  <TabsTrigger value="sentiment">Sentiment Class</TabsTrigger>
                  <TabsTrigger value="product">Product</TabsTrigger>
                </TabsList>
                <TabsContent value="campaign">
                  <CampaignResult campaign={resultcampaigns} />
                </TabsContent>
                <TabsContent value="agent">
                  <RunDisplay run={resultRun} />
                </TabsContent>
                <TabsContent value="generation">
                  <BlurFadeDemo images={resulGen} />
                </TabsContent>
                <TabsContent value="post">
                  <PostCard
                    id={runPost?.productId}
                    title={runPost?.title}
                    description={runPost?.description}
                    hashtags={runPost?.hashtags}
                    images={[]}
                    bid={runPost?.userId}
                    products={products}
                    genId={runPost?.generationId ? runPost?.generationId : null}
                  />
                </TabsContent>

                <TabsContent value="sentiment">
                  <SentimentTable
                    feedbacks={resultFeedbacks?.filter(
                      (feedback) => feedback.productId == productId
                    )}
                    showFilter={false}
                    users={users}
                  />
                </TabsContent>
                <TabsContent value="product">
                  {resultProduct && <ProductCard {...resultProduct} />}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1"></CardFooter>
    </Card>
  );
}
