"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getFeedbacks } from '@/actions/fetch.actions';

const ClientFetch = () => {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState([]);
  
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const fetchedFeedbacks = await getFeedbacks();
        setFeedbacks(fetchedFeedbacks);
      } catch (error) {
        console.error("Error loading feedbacks:", error);
        // You can add a toast notification here if needed
      }
    };
    loadFeedbacks();
  }, []);


  console.log("Feedbacks:", feedbacks);
  
  return (
    <div>
      <h2>Feedbacks</h2>
    </div>
  )
}

export default ClientFetch

