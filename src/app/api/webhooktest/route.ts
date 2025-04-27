// app/api/webhooktest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const config = {
  api: { bodyParser: false },  // disable JSON/body parsing
};

// 1. Same secret derivation
const rawSecret = '12345';
const key = crypto.createHash('sha256').update(rawSecret, 'utf8').digest();

export async function POST(request: NextRequest) {
  // 2. Read the raw hex body
  const hex = await request.text();

  // 3. Convert hex to Buffer
  let raw: Buffer;
  try {
    raw = Buffer.from(hex.trim(), 'hex');
  } catch (err) {
    console.error('❌ Invalid hex payload:', err);
    return NextResponse.json({ error: 'Invalid hex payload' }, { status: 400 });
  }
  console.log('\n🔐 Encrypted payload (hex):', raw.toString('hex'));

  // 4. Extract IV (first 16 bytes) and ciphertext
  if (raw.length <= 16) {
    console.error(`❌ Payload too short: ${raw.length} bytes`);
    return NextResponse.json({ error: 'Payload too short' }, { status: 400 });
  }
  const iv = raw.subarray(0, 16);
  const ciphertext = raw.subarray(16);

  // 5. Decrypt
  let plaintext: string;
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    plaintext = decrypted.toString('utf8');
  } catch (err) {
    console.error('❌ Decryption failed:', err);
    return NextResponse.json({ error: 'Decryption failed' }, { status: 400 });
  }

  // 6. Log decrypted payload
  console.log('\n🔓 Decrypted payload:', plaintext);
  console.log("\n");
  

  // 7. Parse JSON if possible and return
  let data: any;
  try {
    data = JSON.parse(plaintext);
  } catch {
    data = plaintext;
  }
  return NextResponse.json({ received: data });
}
