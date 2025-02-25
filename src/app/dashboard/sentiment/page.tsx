import { SentimentTable } from "@/components/sentiment/sentimentTable";
import { getFeedbacks, getProducts, getUsers } from "@/actions/fetch.actions";
// import { FilterComponent } from "../../../components/sentiment/component/FilterComponent";
import { Card } from "@/components/ui/card";
import InsertFeed from "./insert";

export default async function Home() {
  const products = await getProducts();
  const feedbacks = await getFeedbacks();
  const users = await getUsers();

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
