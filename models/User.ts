import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidCourses: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  trialExpiresAt: {
    type: Date,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
