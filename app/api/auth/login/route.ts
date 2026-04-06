import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sybrai_secret_key_2026";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    // Case-insensitive search
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isPaid: user.isPaid },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        isPaid: user.isPaid 
      } 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
