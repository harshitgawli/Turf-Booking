import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Slots() {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("slots");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  useEffect(() => {
  fetchData();

  const interval = setInterval(() => {
    fetchData();
  }, 10000); // refresh every 10 sec

  return () => clearInterval(interval);
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
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slot) => {
    try {
      const res = await api.post(`/slots/book/${slot._id}`);

      // Redirect to booking pending page
      navigate(`/booking-pending/${slot._id}`);

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
    const bookedById =
      typeof slot.bookedBy === "object"
        ? slot.bookedBy?._id
        : slot.bookedBy;

    const isMySlot = String(bookedById) === String(userId);

    // AVAILABLE
    if (slot.status === "available") {
      return (
        <span className="text-green-600 font-bold">
          Available
        </span>
      );
    }

    // PENDING
    if (slot.status === "pending") {
      return (
        <div className="text-yellow-600 font-bold">
          Pending
          {isMySlot && slot.requestCode && (
            <div className="bg-yellow-100 text-black p-2 mt-2 rounded text-sm">
              Request Code: <strong>{slot.requestCode}</strong>
              <div className="text-xs mt-1">
                Call Admin to confirm booking
              </div>
            </div>
          )}
        </div>
      );
    }

    // BOOKED
    if (slot.status === "booked") {
      return (
        <div className="text-red-600 font-bold">
          Booked
          {isMySlot && slot.bookingNumber && (
            <div className="bg-gray-100 text-black p-2 mt-2 rounded text-sm">
              Booking No: <strong>{slot.bookingNumber}</strong>
            </div>
          )}
        </div>
      );
    }

    return null;
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
            onClick={() => {setActiveTab("my");
              fetchData();
            }}
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
                  <p className="mb-2 font-semibold">
                    Time: {slot.time}
                  </p>

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
                  <p className="mb-2 font-semibold">
                    Time: {slot.time}
                  </p>

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
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-6">
            My Confirmed Bookings
          </h2>

          {myBookings.length === 0 ? (
            <p>No confirmed bookings yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {myBookings.map((slot) => (
                <div key={slot._id} className="bg-white p-6 rounded-xl shadow">
                  <p className="font-semibold mb-2">
                    Date: {slot.date}
                  </p>
                  <p className="mb-2">
                    Time: {slot.time}
                  </p>

                  <div className="bg-gray-100 p-2 rounded text-sm font-bold">
                    Booking No: {slot.bookingNumber}
                  </div>
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
