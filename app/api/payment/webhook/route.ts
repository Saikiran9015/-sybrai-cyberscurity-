import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay signature detected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log(`Received Razorpay event: ${event.event}`);

    // Handle payment.captured or order.paid
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const userId = event.payload.payment?.entity?.notes?.userId || 
                     event.payload.order?.entity?.notes?.userId;

      if (!userId) {
        console.error("No userId found in payment or order notes");
        return NextResponse.json({ message: "No userId in notes, ignoring" }, { status: 200 });
      }

      await connectDB();
      const user = await User.findByIdAndUpdate(userId, { isPaid: true }, { new: true });
      
      if (!user) {
        console.error(`User ${userId} not found during webhook processing`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log(`Successfully updated isPaid status for user: ${user.email}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
