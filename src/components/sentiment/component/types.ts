export type PolarityLabel =
  | "1 star"
  | "2 stars"
  | "3 stars"
  | "4 stars"
  | "5 stars";
export type EmotionLabel =
  | "LABEL_0"
  | "LABEL_1"
  | "LABEL_2"
  | "LABEL_3"
  | "LABEL_4"
  | "LABEL_5";

export interface LabelScore {
  label: PolarityLabel | EmotionLabel;
  score: number;
}

export interface DataItem {
  polarity: LabelScore[];
  emotion: LabelScore[];
  rating: number;
  feedback: String;
  productId: String;
  userId: String;
}

export const polarityLabels: Record<PolarityLabel, string> = {
  "1 star": "Highly Negative",
  "2 stars": "Negative",
  "3 stars": "Neutral",
  "4 stars": "Positive",
  "5 stars": "Highly Positive",
};

export const emotionLabels: Record<EmotionLabel, string> = {
  LABEL_0: "Sad",
  LABEL_1: "Happy",
  LABEL_2: "Love",
  LABEL_3: "Angry",
  LABEL_4: "Fearful",
  LABEL_5: "Surprised",
};

export const ratingLabels: Record<number, string> = {
  1: "1 star",
  2: "2 star",
  3: "3 star",
  4: "4 star",
  5: "5 star",
};
