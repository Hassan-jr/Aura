"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterComponent } from "./component/FilterComponent";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

import CustomerCard from "@/components/sentiment/userCard";
import PolarityChart from "./polarity";
import EmotionChart from "./emotion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChartComponent from "./chart/pie";
import { BarChartComponent } from "./chart/bar";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";

export function SentimentTable({ feedbacks, users, showFilter = true }) {
  const productId = useAppSelector(selectProductId);
  const [productSentiments, setproductSentiments] = useState(
    productId
      ? feedbacks?.filter((feedback) => feedback.productId == productId)
      : []
  );
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(
    productId
      ? feedbacks?.filter((feedback) => feedback.productId == productId)
      : []
  );
  const [sentimentClass, setSentimentClass] = useState({
    polarity: [],
    emotion: [],
    rating: [],
  });

  useEffect(() => {
    const filteredPosts = feedbacks?.filter(
      (feedback) => feedback.productId == productId
    );
    setproductSentiments(filteredPosts);
    setFilteredFeedbacks(filteredPosts);
  }, [productId, feedbacks]);

  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%", // Takes full height of its container
        width: "100%", // Takes full width of its container
      }}
    >
      {/* You can use an SVG, CSS spinner, or a component library spinner */}
      <svg
        className="animate-spin h-8 w-8 text-blue-500" // Example styling
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  return (
    <div>
      {showFilter && (
        <Card className="container mx-auto p-4">
          <FilterComponent
            data={productSentiments}
            setFilteredFeedbacks={setFilteredFeedbacks}
            setSentimentClass={setSentimentClass}
          />
        </Card>
      )}

      <Tabs defaultValue="sentiment" className="w-[400px] mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="chart">Visual Sentiment Chart</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="sentiment">
          <Table className="w-full">
            <TableCaption>A list of your recent Sentiment.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customers Review</TableHead>
                {/* <TableHead>FeedBack</TableHead> */}
                <TableHead>Polarity</TableHead>
                <TableHead className="text-right">Emotion</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell className="font-medium w-auto">
                    <CustomerCard
                      id={feedback.userId}
                      users={users}
                      feedback={feedback.feedback}
                    />
                  </TableCell>
                  {/* <TableCell className="h-80">{feedback.feedback}</TableCell> */}
                  <TableCell className="w-96">
                    {/* <PolarityChart polarity={feedback.polarity} /> */}
                    {feedback.polarity?.length > 0 ? (
                      <PolarityChart polarity={feedback.polarity} />
                    ) : (
                      <div className="flex items-center justify-center h-10 w-10">
                        {/* Use absolute positioning to overlay */}
                        <Spinner />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-96">
                    {/* <EmotionChart emotion={feedback.emotion} /> */}
                    {feedback.polarity?.length > 0 ? (
                      <EmotionChart emotion={feedback.emotion} />
                    ) : (
                      <div className=" flex items-center justify-center h-10 w-10">
                        {/* Use absolute positioning to overlay */}
                        <Spinner />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {feedback.rating}/5
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
          </Table>
        </TabsContent>
        <TabsContent value="chart">
          <PieChartComponent data={filteredFeedbacks} />
          <BarChartComponent data={filteredFeedbacks} />
        </TabsContent>
        <TabsContent value="analysis"></TabsContent>
      </Tabs>
    </div>
  );
}
