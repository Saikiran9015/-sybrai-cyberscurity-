import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR" } = await req.json();

    const options = {
      amount: amount * 100, // Razorpay amount in paise (e.g., 50 INR * 100 = 5000 paise)
      currency,
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    };

    const order = await instance.orders.create(options);
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
