import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentAPI } from '../../services';

export default function EsewaSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) { setError("No payment data received."); return; }
    paymentAPI.esewaVerify({ data })
      .then((res) => navigate(`/order-success/${res.order_id}`, { replace: true }))
      .catch(() => setError("Payment verification failed."));
  }, []);

  return (
    <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
      <div className="bg-white rounded-[32px] p-16 text-center shadow-xl max-w-md w-full mx-4">
        {error ? (
          <>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button onClick={() => navigate("/cart")} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold">Back to Cart</button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-[#C28142] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[#78716C] font-medium">Verifying payment...</p>
          </>
        )}
      </div>
    </div>
  );
}
