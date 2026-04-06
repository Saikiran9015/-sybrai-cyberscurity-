import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // Case-insensitive duplicate check
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if this is the first user to make them admin automatically
    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("[Register Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
