import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
const API = import.meta.env.VITE_BACKEND_URL;

  const [status, setStatus] = useState("verifying");

  // get token from URL
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      setStatus("invalid");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.post(`${API}/user/verify`, {
          code,
        });

        setStatus("success");

        // redirect to sign-in page after short delay
        setTimeout(() => navigate("/signin"), 1500);
      } catch (error) {
        // console.error(error);
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified successfully ✅</p>}
      {status === "failed" && <p>Verification failed ❌</p>}
      {status === "invalid" && <p>Invalid verification link ⚠️</p>}
    </div>
  );
};

export default VerifyEmail;
