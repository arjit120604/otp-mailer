import { OTP, Entry } from "./model.mjs";
import generateOtp from "./utils/generateOtp.mjs";
import sendMail from "./utils/sendMail.mjs";

const verifyOtp = async ({ email, otp, amt }) => {
  try {
    if (!email || !otp) {
      throw Error("give all fields");
    }

    const match = await OTP.findOne({ email: email });
    if (!match) {
      throw Error("otp expired");
    }

    if (match.otp === otp) {
      await Entry.deleteOne({ email });
      const newEntry = new Entry({
        email: email,
        otp: otp,
        otpVerified: match.otp === otp,
        amt: amt,
        createdAt: Date.now(),
      });
      await newEntry.save();
      await OTP.deleteOne({ email: email });
    }

    return match.otp === otp;
  } catch (error) {
    console.log(error);
  }
};

const sendOtp = async ({
  email,
  subject = "testing",
  amt = "",
  duration = 25,
}) => {
  try {
    if (!email) {
      throw Error("provide all fields");
    }

    await OTP.deleteOne({ email }); //deleting the old record if any if a new otp is requested

    const generatedOtp = generateOtp();
    console.log(generatedOtp);

    const emailHtml = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #007bff; 
        }
        .amt{
          font-size: 20px;
          font-weight: bold;
          color: #007bff; 
        }
      </style>
    </head>
    <body>
    <div class="container">
      <h2>Your One-Time Password (OTP)</h2>
      <p>Here is your OTP for verification:</p>
      <p class="otp-code">${generatedOtp}</p>
      <p>The amount to be spent: ₹<span class="amt">${amt}</span></p>
      <p>This OTP is valid for ${duration - 5} minutes.</p>
      <p>Please do not share this OTP with anyone.</p>
      <p>If you didn't request this OTP, you can safely ignore this email.</p>
    </div>
  </body>
    </html>
  `;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject,
      html: emailHtml,
    };
    await sendMail(mailOptions);

    const expiresAt = new Date(Date.now() + duration * 60000); //current time plus duration minutes
    // const expiresAt = new Date(Date.now() + 1);

    const newOTP = new OTP({
      email,
      otp: generatedOtp,
      createdAt: Date.now(),
      expiresAt: expiresAt,
    });

    const createdRecord = await newOTP.save();
    return createdRecord;
  } catch (error) {
    console.log(error);
  }
};

export { sendOtp, verifyOtp };
