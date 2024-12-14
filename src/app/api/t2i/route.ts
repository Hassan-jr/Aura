import { NextResponse } from "next/server";

export async function GET() {
  // const { userId } = auth();
  // const user = await currentUser();
  const userId = "12345678"

  if (!userId) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  return NextResponse.json(
    {
      message: "Authenticated",
      data: { userId: userId, username: "Test User" },
    },
    { status: 200 }
  );
}