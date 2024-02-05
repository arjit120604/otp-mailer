import express from "express";
import { sendOtp } from "../controller.mjs";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, subject, amt, duration } = req.body;

    const createdOtp = await sendOtp({
      email,
      subject,
      amt,
      duration,
    });
    // res.status(200).json(createdOtp);
    res.status(200).json({ message: "OTP created successfully", ok: true });
  } catch (error) {
    console.log(error);
  }
});

export default router;
