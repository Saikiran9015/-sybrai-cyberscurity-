import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://abbusaikiran40_db_user:Sybrai9493@sybrai.sdglzks.mongodb.net/Sybrai?retryWrites=true&w=majority&appName=Sybrai";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for secure seeding...");

    const email = "Sybrai@gmail.com";
    const password = "Sybrai9493@#";
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.findOneAndUpdate(
      { email },
      { 
        name: "Sybrai",
        email, 
        password: hashedPassword,
        isAdmin: true,
        isPaid: true
      },
      { upsert: true, new: true }
    );

    console.log("SUCCESS: Secure User Created/Updated:", result.email);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
}

seed();
