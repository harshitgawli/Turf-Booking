import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookingPending() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlot();
  }, []);

  const fetchSlot = async () => {
    try {
      const res = await api.get("/slots");
      const foundSlot = res.data.find((s) => s._id === id);

      if (!foundSlot) {
        setSlot(null);
      } else {
        setSlot(foundSlot);
      }

    } catch (err) {
      console.error("Failed to fetch slot", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No booking data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">

        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Booking Request Created
        </h2>

        <p className="mb-2"><strong>Date:</strong> {slot.date}</p>
        <p className="mb-4"><strong>Time:</strong> {slot.time}</p>

        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="text-yellow-800 font-semibold">
            Status: {slot.status}
          </p>
        </div>

        {slot.requestCode && (
          <div className="bg-gray-100 p-3 rounded mb-6">
            Request Code: <strong>{slot.requestCode}</strong>
            <div className="text-sm mt-1">
              Call admin and tell this code.
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="font-semibold mb-2">Admin Contact:</p>
          <p className="text-xl font-bold text-green-600">
            +91 9876543210
          </p>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Scan & Pay</p>
          <img
            src="/qr.png"
            alt="QR"
            className="w-48 mx-auto border rounded"
          />
        </div>

        <button
          onClick={() => navigate("/slots")}
          className="w-full bg-green-500 text-white py-2 rounded-lg"
        >
          Back to Slots
        </button>

      </div>
    </div>
  );
}

export default BookingPending;
