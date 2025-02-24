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
import { useState } from "react";

import CustomerCard from "@/components/sentiment/userCard";
import PolarityChart from "./polarity";
import EmotionChart from "./emotion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChartComponent from "./chart/pie";
import { BarChartComponent } from "./chart/bar";

export function SentimentTable({ feedbacks, products, users }) {
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(feedbacks);
  const [sentimentClass, setSentimentClass] = useState({
    polarity: [],
    emotion: [],
    rating: [],
  })
  return (
    <div>
      <Card className="container mx-auto p-4">
        <FilterComponent
          data={feedbacks}
          setFilteredFeedbacks={setFilteredFeedbacks}
          setSentimentClass={setSentimentClass}
        />
      </Card>

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
                    <PolarityChart polarity={feedback.polarity} />
                  </TableCell>
                  <TableCell className="w-96">
                    <EmotionChart emotion={feedback.emotion} />
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
          <BarChartComponent  data={filteredFeedbacks} />
        </TabsContent>
        <TabsContent value="analysis"></TabsContent>
      </Tabs>
    </div>
  );
}
