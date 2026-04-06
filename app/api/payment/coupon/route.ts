import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { couponCode, userId } = await req.json();

    if (couponCode !== "Sybrai2026") {
      return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
    }

    await connectDB();
    
    // Grant 30 minutes of access
    const trialExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { trialExpiresAt },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "30-minute trial access granted!",
      user: updatedUser 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
