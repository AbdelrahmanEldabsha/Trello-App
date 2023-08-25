import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["female", "male", "not specified"],
      default: "not specified",
    },
    age: {
      type: Number,
      default: 20,
    },
    phone: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isConfirmed: { type: Boolean, default: false },
    profilePic: { secure_url: String, public_id: String },
    coverPics: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const userModel = mongoose.model("User", userSchema)
