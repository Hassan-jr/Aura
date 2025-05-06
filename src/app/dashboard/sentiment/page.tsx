"use client"
import { SentimentTable } from "@/components/sentiment/sentimentTable";
import { useAppSelector } from "@/redux/hooks";
import { selectfeedbacks } from "@/redux/slices/feeback";
import { selectusers } from "@/redux/slices/user";

export default function Home() {
 const feedbacks = useAppSelector(selectfeedbacks);
 const users = useAppSelector(selectusers);

  return (
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Sentiment Analysis</h1>
        {/* <MakePostDialog /> */}
      </div>

      <div className="">
        <SentimentTable
          feedbacks={feedbacks}
          // products={products}
          users={users}
        />
      </div>
    </main>
  );
}
