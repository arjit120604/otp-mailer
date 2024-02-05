import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OTPSchema = new Schema({
  email: { type: String, unique: true },
  otp: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 },
});

const OTP = model("OTP", OTPSchema);

const EntrySchema = new Schema({
  email: String,
  otp: String,
  otpVerified: Boolean,
  amt: Number,
  createdAt: Date,
});

const Entry = model("entry", EntrySchema);

export { OTP, Entry };
