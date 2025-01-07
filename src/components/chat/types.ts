export interface Message {
  userId: string;
  productId: string;
  role: "user" | "assistant";
  content: string;
  bId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
}
