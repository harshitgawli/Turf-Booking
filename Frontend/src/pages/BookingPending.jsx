import { useLocation, useNavigate } from "react-router-dom";
import qr from "../assets/images/qr.png";
function BookingPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;
 

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
          Booking Request Sent
        </h2>

        <p className="mb-4">
          <strong>Date:</strong> {slot.date}
        </p>
        <p className="mb-6">
          <strong>Time:</strong> {slot.time}
        </p>

        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="text-yellow-800 font-semibold">
            Status: Pending Confirmation
          </p>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Call Admin:</p>
          <p className="text-xl font-bold text-green-600">
            +91 9876543210
          </p>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Scan & Pay</p>
          <img
            src={qr}
            alt="Payment QR"
            className="w-48 mx-auto rounded-lg border"
          />
        </div>

        <div className="bg-gray-100 p-3 rounded mb-4">

             <h2 className="text-2xl font-bold mb-4 text-green-700">
          Please call admin and tell this Request Code.

        </h2>
  Request Code: <strong>{slot.requestCode}</strong>
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
