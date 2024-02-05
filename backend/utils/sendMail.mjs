import nodemailer from "nodemailer";
import dotenv from "dotenv";
import * as aws from "@aws-sdk/client-ses";
dotenv.config();

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});
let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log("aws verified");
    // console.log(success);
  }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (err) {
    console.log("error sending mail");
    // console.log(err);
    console.log(err);
  }
};

export default sendEmail;
