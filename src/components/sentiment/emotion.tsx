"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

const chartConfig = {
  score: {
    label: "score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function EmotionChart({emotion}) {

    const [newemotion, setNewemotion] = useState(emotion)

    useEffect(()=>{
        setNewemotion(emotion)
    },[emotion])

    const emotions = ["Sad", "Happy", "Love", "Angery", "Fearful", "Surprised"];
    const chartData = newemotion.map((item, index) => ({
        emotion: emotions[index],
        score: item.score,
      }));

      const highestScore = chartData.reduce((max, current) => {
        return current.score > max.score ? current : max;
      }, chartData[0]);
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>{highestScore?.emotion} - {highestScore?.score.toFixed(3)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
            className="p-0 m-0"
          >
            <XAxis type="number" dataKey="score" hide />
            <YAxis
              dataKey="emotion"
              type="category"
              tickLine={false}
              tickMargin={1}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="score" fill="var(--color-score)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
