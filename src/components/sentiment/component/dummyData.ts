import { DataItem } from './types';

export const dummyData: DataItem[] = [
  {
    polarity: [
      { label: '1 star', score: 0.1 },
      { label: '2 star', score: 0.2 },
      { label: '3 star', score: 0.3 },
      { label: '4 star', score: 0.2 },
      { label: '5 star', score: 0.2 },
    ],
    emotion: [
      { label: 'LABEL_0', score: 0.1 },
      { label: 'LABEL_1', score: 0.2 },
      { label: 'LABEL_2', score: 0.3 },
      { label: 'LABEL_3', score: 0.2 },
      { label: 'LABEL_4', score: 0.1 },
      { label: 'LABEL_5', score: 0.1 },
    ],
    rating: 3,
    userId: "",
    productId: "",
    feedback: "",
  },
  // Add more dummy data items here...
];

