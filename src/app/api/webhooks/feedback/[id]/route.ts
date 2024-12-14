import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/db';
import { Feedback } from '@/modals/feedback.modal';

export async function POST(request: NextRequest) {
  // Extract the ID from the URL
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const data = await request.json();

    // Update the Feedback document
    if (data.status === "COMPLETED") {
      const polarity = data.output.polarity[0];
      const emotion = data.output.emotion[0];

      await Feedback.findByIdAndUpdate(
        id,
        { polarity, emotion }
      );
    }

    // Return a 200 status to acknowledge successful receipt
    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}

