import { createCampaignResult } from "@/actions/campaginResult.action";
import { createAgent } from "@/actions/createAgent.action";
import { getSingleProducts } from "@/actions/fetch.actions";
import { CampaignResult } from "@/modals/campaignResult.modal";
import { NextResponse } from "next/server";

const TRIGGER_SECRET = process.env.ATLAS_TRIGGER_SECRET || "416TriggerKEY123"; // Use env variable

export async function POST(request: Request) {
  const receivedSecret = request.headers.get("x-trigger-secret");
  if (receivedSecret !== TRIGGER_SECRET) {
    console.warn("Invalid or missing X-Trigger-Secret received.");
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const campaignData = await request.json(); // Parse JSON body

    if (!campaignData || typeof campaignData !== "object") {
      console.error("Received invalid data format:", campaignData);
      return NextResponse.json(
        { success: false, message: "Bad Request: Invalid JSON data." },
        { status: 400 }
      );
    }

    console.log("Received campaign data via Atlas Trigger:");
    console.log(JSON.stringify(campaignData, null, 2)); // Log the received object

    // --- YOUR PROCESSING LOGIC HERE ---
    // create a mongdb document and trigger the agent with product title

    // @@@@@@@@@@@@@@@@@@@@@@@@@ GET PRODUCT TITLE @@@@@@@@@@@@@@@@@@@@@@@@@@@
    const product = await getSingleProducts(campaignData.productId);

    if (!product.title) {
      console.error("Unable to get Product Title:", product);
      return NextResponse.json(
        { success: false, message: "No Product Title" },
        { status: 400 }
      );
    }

    console.log("Creating Agent For:", product?.title);
    const agentResult = await createAgent(
      product?.title,
      campaignData.userId,
      campaignData.productId
    );

    // Creating campagin
    console.log("Creating Campagin");
    
    const compaginResult = {
      userId: campaignData.userId,
      productId: campaignData.productId,
      outputType: campaignData.outputType,
      numberOfPhotos: campaignData.numberOfPhotos,
      campaignId: campaignData._id,
      generationId: "",
      postId: "",
      agentId: agentResult.mongodbId,
      sentimentClass: campaignData.sentimentClass,
      publishSites: campaignData.publishSites,
    };

    const createCampaignResultData = await createCampaignResult(compaginResult);

    return NextResponse.json(
      { success: true, message: "Campaign received successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Catch JSON parsing errors
      console.error("Error parsing JSON body:", error);
      return NextResponse.json(
        { success: false, message: "Bad Request: Invalid JSON format." },
        { status: 400 }
      );
    }
    console.error("Error processing campaign data in API:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: Handler for GET or other methods
export async function GET(request: Request) {
  return NextResponse.json(
    { message: "Method GET Not Allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
