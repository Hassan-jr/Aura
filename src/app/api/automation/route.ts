import { NextResponse } from 'next/server';

const TRIGGER_SECRET = process.env.ATLAS_TRIGGER_SECRET || "416TriggerKEY123"; // Use env variable

export async function POST(request: Request) {
  const receivedSecret = request.headers.get('x-trigger-secret');
  if (receivedSecret !== TRIGGER_SECRET) {
    console.warn('Invalid or missing X-Trigger-Secret received.');
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const campaignData = await request.json(); // Parse JSON body

     if (!campaignData || typeof campaignData !== 'object') {
        console.error("Received invalid data format:", campaignData);
        return NextResponse.json({ success: false, message: 'Bad Request: Invalid JSON data.' }, { status: 400 });
    }

    console.log('Received campaign data via Atlas Trigger:');
    console.log(JSON.stringify(campaignData, null, 2)); // Log the received object

    // --- YOUR PROCESSING LOGIC HERE ---

    return NextResponse.json({ success: true, message: 'Campaign received successfully.' }, { status: 200 });

  } catch (error) {
     if (error instanceof SyntaxError) { // Catch JSON parsing errors
        console.error('Error parsing JSON body:', error);
        return NextResponse.json({ success: false, message: 'Bad Request: Invalid JSON format.' }, { status: 400 });
    }
    console.error('Error processing campaign data in API:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: Handler for GET or other methods
export async function GET(request: Request) {
  return NextResponse.json({ message: 'Method GET Not Allowed' }, { status: 405, headers: { Allow: 'POST' } });
}