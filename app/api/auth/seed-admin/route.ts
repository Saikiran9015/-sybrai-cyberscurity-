import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    
    const email = "Sybrai@gmail.com";
    const password = "Sybrai9493@#";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { 
        name: "Sybrai Admin",
        email, 
        password: hashedPassword,
        isAdmin: true,
        isPaid: true,
        paidCourses: ["ethical-hacking", "network-security"]
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Administrative account Sybrai@gmail.com created/updated.",
      user: { email: user.email, isAdmin: user.isAdmin, isPaid: user.isPaid }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
