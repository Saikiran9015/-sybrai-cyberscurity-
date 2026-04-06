import mongoose from "mongoose";
import dns from "dns";

// Fix for ECONNREFUSED on some networks by forcing Google DNS for SRV lookups
if (typeof window === "undefined") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || "";
  
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env.local file");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // Increased timeout for slow DNS
      connectTimeoutMS: 15000,
      family: 4, // Force IPv4 to avoid some SRV issues
    };

    console.log("[MongoDB] Attempting secure link...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("[MongoDB] Connection established.");
      return mongoose;
    }).catch((err) => {
      console.error("[MongoDB] Connection failed:", err.message);
      // If SRV fails, we might need the user to provide the non-SRV string
      cached.promise = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
