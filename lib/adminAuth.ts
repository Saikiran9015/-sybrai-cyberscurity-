import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "./mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "sybrai_secret_key_2026";

export async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (user && user.isAdmin) {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}
