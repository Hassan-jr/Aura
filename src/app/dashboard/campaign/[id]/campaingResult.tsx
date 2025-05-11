import { Button } from "@/components/ui/button";
import React from "react";

const CampaignResult = ({ campaign }) => {
  return (
    <div key={campaign._id} className="border p-4 rounded-lg shadow-sm">
      <div className="flex flex-row flex-wrap justify-between align-middle">
        <h3 className="font-semibold mb-4">{campaign.title}</h3>
      </div>

      <table className="w-full mb-4 border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Frequency
            </td>
            <td className="py-2 px-4">{campaign.frequency}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Scheduled
            </td>
            <td className="py-2 px-4">
              {new Date(campaign.scheduledTime).toLocaleString()}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Vision Model Outputs
            </td>
            <td className="py-2 px-4">{campaign.outputType}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Sites
            </td>
            <td className="py-2 px-4">
              {Object.entries(campaign.publishSites)
                .filter(([_, value]) => value)
                .map(([key]) => key)
                .join(", ")}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Polarity
            </td>
            <td className="py-2 px-4">
              <pre className="inline">
                {campaign?.sentimentClass?.polarity
                  ?.map(
                    (star) =>
                      ({
                        "1 star": "Highly Negative",
                        "2 stars": "Negative",
                        "3 stars": "Neutral",
                        "4 stars": "Positive",
                        "5 stars": "Highly Positive",
                      }[star] || star)
                  )
                  .join(", ")}
              </pre>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Emotion
            </td>
            <td className="py-2 px-4">
              <pre className="inline">
                {campaign?.sentimentClass?.emotion
                  ?.map(
                    (label) =>
                      ({
                        LABEL_0: "Sad",
                        LABEL_1: "Happy",
                        LABEL_2: "Love",
                        LABEL_3: "Angry",
                        LABEL_4: "Fearful",
                        LABEL_5: "Surprised",
                      }[label] || label)
                  )
                  .join(", ")}
              </pre>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 text-gray-600 border-r font-medium">
              Rating
            </td>
            <td className="py-2 px-4">
              <pre className="inline">
                {/* {JSON.stringify(campaign.sentimentClass.rating, null, 2)} */}
                {campaign?.sentimentClass?.rating
                  .map((rating) => `${rating}/5`)
                  .join(", ")}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CampaignResult;
