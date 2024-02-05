import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import sendOtp from "./routes/sendOtp.mjs";
import verifyOtp from "./routes/verifyOtp.mjs";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 5001;

const dbUrl = process.env.MONGO_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

connectToDB();

app.use("/sendotp", sendOtp);
app.use("/verifyotp", verifyOtp);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
