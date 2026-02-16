import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get("/slots/all-bookings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBookings(res.data);

    } catch (err) {
      console.error("Admin load error:", err.response?.data || err.message);
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id) => {
    try {
      await api.post(
        `/slots/confirm/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast("Booking confirmed successfully 🎉");
      loadBookings();

    } catch (err) {
      showToast(err.response?.data?.message || "Error confirming booking", "error");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.post(
        `/slots/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast("Booking cancelled successfully");
      loadBookings();

    } catch (err) {
      showToast(err.response?.data?.message || "Error cancelling booking", "error");
    }
  };

  const createSlot = async () => {
    if (!date || !time) {
      showToast("Enter date & time", "error");
      return;
    }

    try {
      await api.post(
        "/slots/create",
        { date, time },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDate("");
      setTime("");
      loadBookings();

      showToast("New slot created successfully 🎉");

    } catch (err) {
      showToast(err.response?.data?.message || "Error creating slot", "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "booked");

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${
              toast.type === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Slot */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-lg font-bold mb-4">Create Slot</h2>

        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="6PM - 7PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={createSlot}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section
            title="Pending Requests"
            data={pending}
            confirm={confirmBooking}
            cancel={cancelBooking}
          />

          <Section
            title="Confirmed Bookings"
            data={confirmed}
          />
        </>
      )}
    </div>
  );
}

function Section({ title, data, confirm, cancel }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">
        {title} ({data.length})
      </h2>

      {data.length === 0 ? (
        <p>No records</p>
      ) : (
        data.map(slot => (
          <div key={slot._id} className="bg-white p-6 rounded-xl shadow mb-4">
            <p><strong>Date:</strong> {slot.date}</p>
            <p><strong>Time:</strong> {slot.time}</p>
            <p><strong>Name:</strong> {slot.bookedBy?.name || "N/A"}</p>
            <p><strong>Email:</strong> {slot.bookedBy?.email || "N/A"}</p>
            <p><strong>Mobile:</strong> {slot.bookedBy?.mobile || "N/A"}</p>

            {slot.requestCode && (
              <div className="bg-yellow-100 p-2 rounded mt-2">
                Request Code: <strong>{slot.requestCode}</strong>
              </div>
            )}

            {slot.bookingNumber && (
              <div className="bg-green-100 p-2 rounded mt-2">
                Booking No: <strong>{slot.bookingNumber}</strong>
              </div>
            )}

            {slot.status === "pending" && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => confirm(slot._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => cancel(slot._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
