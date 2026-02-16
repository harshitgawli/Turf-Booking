import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Slots() {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("slots");
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/slots");

      const filtered = res.data.filter(
        (slot) => slot.date === today || slot.date === tomorrow
      );

      setSlots(filtered);

      const myRes = await api.get("/slots/my-bookings");
      setMyBookings(myRes.data);

    } catch (err) {
      console.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slot) => {
  try {
    await api.post(`/slots/book/${slot._id}`);

    navigate("/booking-pending", {
      state: { slot }
    });

  } catch (err) {
    alert(err.response?.data?.message || "Booking failed");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderStatus = (slot) => {
    if (slot.status === "available")
      return <span className="text-green-600 font-bold">Available</span>;

    if (slot.status === "pending")
      return <span className="text-yellow-600 font-bold">Pending</span>;

    return (
      <span className="text-red-600 font-bold">
        Booked
        {slot.bookingNumber && (
          <div className="text-sm text-black mt-1">
            Booking No: {slot.bookingNumber}
          </div>
        )}
      </span>
    );
  };

  const todaySlots = slots.filter((s) => s.date === today);
  const tomorrowSlots = slots.filter((s) => s.date === tomorrow);

  return (
    <div className="min-h-screen bg-green-100 p-6">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sportify Turf</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "slots"
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            Slots
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "my"
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            My Bookings
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === "slots" ? (
        <>
          {/* TODAY */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              Today ({today})
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {todaySlots.map((slot) => (
                <div key={slot._id} className="bg-white p-6 rounded-xl shadow">
                  <p className="mb-2 font-semibold">Time: {slot.time}</p>
                  {renderStatus(slot)}

                  {slot.status === "available" && (
                    <button
                      onClick={() => handleBook(slot)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg mt-4"
                    >
                      Book Slot
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TOMORROW */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Tomorrow ({tomorrow})
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {tomorrowSlots.map((slot) => (
                <div key={slot._id} className="bg-white p-6 rounded-xl shadow">
                  <p className="mb-2 font-semibold">Time: {slot.time}</p>
                  {renderStatus(slot)}

                  {slot.status === "available" && (
                    <button
                      onClick={() => handleBook(slot._id)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg mt-4"
                    >
                      Book Slot
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-6">My Confirmed Bookings</h2>

          {myBookings.length === 0 ? (
            <p>No confirmed bookings yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {myBookings.map((slot) => (
                <div key={slot._id} className="bg-white p-6 rounded-xl shadow">
                  <p className="font-semibold mb-2">Date: {slot.date}</p>
                  <p className="mb-2">Time: {slot.time}</p>

                  {slot.bookingNumber && (
                    <div className="bg-gray-100 p-2 rounded text-sm font-bold">
                      Booking No: {slot.bookingNumber}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Slots;
