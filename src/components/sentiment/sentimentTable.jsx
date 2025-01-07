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

import CustomerCard from "@/components/sentiment/userCard";
import PolarityChart from "./polarity";
import EmotionChart from "./emotion";

export function SentimentTable({ feedbacks, products, users }) {
  return (
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
        {feedbacks.map((feedback) => (
          <TableRow key={feedback._id}>
            <TableCell className="font-medium w-auto">
              <CustomerCard id={feedback.userId} users={users} feedback={feedback.feedback} />
            </TableCell>
            {/* <TableCell className="h-80">{feedback.feedback}</TableCell> */}
            <TableCell className="w-96">
              <PolarityChart polarity={feedback.polarity.toObject()} />
            </TableCell>
            <TableCell className="w-96">
              <EmotionChart emotion={feedback.emotion.toObject()} />
            </TableCell>
            <TableCell className="text-right">{feedback.rating}/5</TableCell>
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
  );
}
