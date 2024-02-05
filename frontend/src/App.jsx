import { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";

function App() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [amt, setAmt] = useState(0);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAmtChange = (e) => {
    setAmt(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    if (!amt || !email || amt < 0) {
      return alert("all fields needed");
    }
    setSending(true);
    try {
      const res = await axios.post("http://localhost:5001/sendotp", {
        email,
        amt,
      });
      // console.log(res.data.ok);
      if (res.data.ok) {
        alert("OTP sent successfully");
      }
      setSent(true);
      // console.log(response.data); //
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
    setTimeout(() => {
      setSending(false);
    }, 7000);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:5001/verifyotp", {
        otp,
        email,
        amt,
      });
      if (response.data.valid) {
        alert("OTP verified successfully");
        setEmail("");
        setAmt(0);
        setOtp("");
        setSent(false);
      } else {
        alert("wrong otp");
        setOtp("");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <>
      <div className="bg-[#fefae0] flex justify-center flex-col min-h-screen p-8">
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-semibold mb-2">
            Email:
          </label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-400 px-3 py-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amt" className="block text-lg font-semibold mb-2">
            Amount:
          </label>

          <input
            type="number"
            id="amt"
            value={amt}
            onChange={handleAmtChange}
            className="border border-gray-400 px-3 py-2 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleSendOtp}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ${
            sending ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          Send OTP
        </button>

        {sent && (
          <>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-lg font-semibold mb-2">
                OTP:
              </label>
              <input
                type="number"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                className="border border-gray-400 px-3 py-2 rounded-md w-full"
              />
            </div>

            <button
              onClick={handleVerify}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
