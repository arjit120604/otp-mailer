import expess from "express";
import { verifyOtp } from "../controller.mjs";

const router = expess.Router();

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
    const { email, otp, amt } = req.body;
    // console.log("amt: " + amt + "email:" + email);
    const validOtp = await verifyOtp({ email, otp, amt });
    res.status(200).json({ valid: validOtp });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
