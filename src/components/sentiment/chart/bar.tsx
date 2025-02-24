"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { label: "January", total: 186 },
  { label: "February", total: 305 },
  { label: "March", total: 237 },
  { label: "April", total: 73 },
  { label: "May", total: 209 },
  { label: "June", total: 214 },
];

const chartConfig = {
  total: {
    label: "total",
    color: "hsl(var(--chart-1))",
  },
//   total: {
//     label: "total",
//   },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const polarityLabels = {
  "1 star": "Highly Negative",
  "2 stars": "Negative",
  "3 stars": "Neutral",
  "4 stars": "Positive",
  "5 stars": "Highly Positive",
};

const emotionLabels = {
  LABEL_0: "Sad",
  LABEL_1: "Happy",
  LABEL_2: "Love",
  LABEL_3: "Angry",
  LABEL_4: "Fearful",
  LABEL_5: "Surprised",
};

const ratingLabels = {
  1: "1 star",
  2: "2 stars",
  3: "3 stars",
  4: "4 stars",
  5: "5 stars",
};

const fill = [
  "var(--color-chrome)",
  "var(--color-safari)",
  "var(--color-firefox)",
  "var(--color-edge)",
  "var(--color-other)",
  "var(--color-firefox)",
  // ... add more fill colors as needed
];

function processFeedbackData(data) {
  // Initialize counters for polarity, emotion, and rating
  const polarityTotals = {};
  const emotionTotals = {};
  const ratingTotals = {};

  // Populate counters with initial values of 0
  for (const label in polarityLabels) {
    polarityTotals[polarityLabels[label]] = 0;
  }

  for (const label in emotionLabels) {
    emotionTotals[emotionLabels[label]] = 0;
  }

  for (const rating in ratingLabels) {
    ratingTotals[ratingLabels[rating]] = 0;
  }

  // Iterate through the data
  data.forEach((entry) => {
    // Find the highest score for polarity
    const highestPolarity = entry.polarity.reduce((max, current) =>
      current.score > max.score ? current : max
    );

    // Increment the count for the corresponding polarity label
    polarityTotals[polarityLabels[highestPolarity.label]] += 1;

    // Find the highest score for emotion
    const highestEmotion = entry.emotion.reduce((max, current) =>
      current.score > max.score ? current : max
    );

    // Increment the count for the corresponding emotion label
    emotionTotals[emotionLabels[highestEmotion.label]] += 1;

    // Increment the count for the rating
    const ratingLabel = ratingLabels[entry.rating];
    ratingTotals[ratingLabel] += 1;
  });

  // Format the output with fill colors based on index
  const Polarity = Object.entries(polarityTotals).map(
    ([label, total], index) => ({
      label,
      total,
      fill: fill[index % fill.length], // Use modulo to cycle through fill colors if needed
    })
  );

  const Emotion = Object.entries(emotionTotals).map(
    ([label, total], index) => ({
      label,
      total,
      fill: fill[index % fill.length],
    })
  );

  const Rating = Object.entries(ratingTotals).map(([label, total], index) => ({
    label,
    total,
    fill: fill[index % fill.length],
  }));

  return { Polarity, Emotion, Rating };
}

export function BarChartComponent({ data }) {
  const { Polarity, Emotion, Rating } = processFeedbackData(data);
  return (
    <div className="grid w-full grid-cols-3 gap-1">
        {/* polarity */}
        <Card>
      <CardHeader>
        <CardTitle>Polarity Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={Polarity}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this label <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 labels
        </div>
      </CardFooter>
    </Card>
    {/* emotion */}
    <Card>
      <CardHeader>
        <CardTitle>Emotion Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={Emotion}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this label <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 labels
        </div>
      </CardFooter>
    </Card>
    {/* rating */}
    <Card>
      <CardHeader>
        <CardTitle>Rating Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={Rating}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this label <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 labels
        </div>
      </CardFooter>
    </Card>

    </div>
  
  );
}
