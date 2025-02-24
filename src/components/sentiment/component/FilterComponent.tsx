"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RoundCheckbox } from "@/components/ui/round-checkbox";
import { Label } from "@/components/ui/label";
import {
  DataItem,
  PolarityLabel,
  EmotionLabel,
  polarityLabels,
  emotionLabels,
  ratingLabels,
} from "./types";

export const FilterComponent = ({ data, setFilteredFeedbacks, setSentimentClass }) => {
  const [selectedPolarity, setSelectedPolarity] = useState<PolarityLabel[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLabel[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const handlePolarityChange = (label: PolarityLabel) => {
    setSelectedPolarity((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleEmotionChange = (label: EmotionLabel) => {
    setSelectedEmotions((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const [filteredData, setfilteredData] = useState(
    data.filter((item) => {
      const polarityMatch =
        selectedPolarity.length === 0 ||
        selectedPolarity.includes(
          item.polarity.reduce((a, b) => (a.score > b.score ? a : b))
            .label as PolarityLabel
        );
      const emotionMatch =
        selectedEmotions.length === 0 ||
        selectedEmotions.includes(
          item.emotion.reduce((a, b) => (a.score > b.score ? a : b))
            .label as EmotionLabel
        );
      const ratingMatch =
        selectedRatings.length === 0 || selectedRatings.includes(item.rating);
      return polarityMatch && emotionMatch && ratingMatch;
    })
  );

  useEffect(() => {
    setfilteredData(
      data.filter((item) => {
        const polarityMatch =
          selectedPolarity.length === 0 ||
          selectedPolarity.includes(
            item.polarity.reduce((a, b) => (a.score > b.score ? a : b))
              .label as PolarityLabel
          );
        const emotionMatch =
          selectedEmotions.length === 0 ||
          selectedEmotions.includes(
            item.emotion.reduce((a, b) => (a.score > b.score ? a : b))
              .label as EmotionLabel
          );
        const ratingMatch =
          selectedRatings.length === 0 || selectedRatings.includes(item.rating);
        return polarityMatch && emotionMatch && ratingMatch;
      })
    );
  }, [selectedPolarity, selectedEmotions, selectedRatings]);

  useEffect(() => {
    setFilteredFeedbacks(filteredData);
    setSentimentClass({
      polarity: selectedPolarity,
      emotion: selectedEmotions,
      rating: selectedRatings,
    })
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Filter by Polarity</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {Object.entries(polarityLabels).map(([label, name]) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox
                id={`polarity-${label}`}
                className="rounded-full bg-white w-6 h-6"
                checked={selectedPolarity.includes(label as PolarityLabel)}
                onCheckedChange={() =>
                  handlePolarityChange(label as PolarityLabel)
                }
              />
              <Label htmlFor={`polarity-${label}`}>{name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Filter by Emotion</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {Object.entries(emotionLabels).map(([label, name]) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox
                id={`emotion-${label}`}
                className="rounded-full bg-white w-6 h-6"
                checked={selectedEmotions.includes(label as EmotionLabel)}
                onCheckedChange={() =>
                  handleEmotionChange(label as EmotionLabel)
                }
              />
              <Label htmlFor={`emotion-${label}`}>{name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Filter by Rating</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {Object.entries(ratingLabels).map(([rating, label]) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                className="rounded-full bg-white w-6 h-6"
                checked={selectedRatings.includes(Number(rating))}
                onCheckedChange={() => handleRatingChange(Number(rating))}
              />
              <Label htmlFor={`rating-${rating}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Filtered Results</h3>
        <p>Number of items: {filteredData.length}</p>
        {/* You can display more details about the filtered data here */}
      </div>
    </div>
  );
};
