"use client";
import { CampaignSetupPage } from "./component/CampaignSetupPage";
import { getFeedbacks } from "@/actions/fetch.actions";
import { auth } from "@/app/auth";
import { fetchAgent } from "@/utils/fetchAgent";

import { useAppSelector } from "@/redux/hooks";
import { selectfeedbacks } from "@/redux/slices/feeback";
import { selectagents } from "@/redux/slices/agent";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const feedbacks = useAppSelector(selectfeedbacks);
  const fetchedRuns = useAppSelector(selectagents);

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
