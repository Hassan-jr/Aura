import { CampaignSetupPage } from "./component/CampaignSetupPage";
import { getFeedbacks, getProducts, getUsers } from "@/actions/fetch.actions";
import { auth } from "@/app/auth";
import { fetchAgent } from "@/utils/fetchAgent";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  const feedbacks = await getFeedbacks();
  const fetchedRuns = await fetchAgent(userId);
  return (
    <main>
      <CampaignSetupPage
        userId={userId}
        feedbacks={feedbacks}
        runs={fetchedRuns}
      />
    </main>
  );
}
