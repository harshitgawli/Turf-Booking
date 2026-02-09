import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/slots");
      setSlots(res.data);
    } catch (err) {
      showToast("Failed to load slots", "error");
    } finally {
      setLoading(false);
    }
  };

  const payAndBook = async (slotId, slotInfo) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Please login to book a slot", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // 1️⃣ Create order from backend
      const res = await api.post(
        `/slots/create-order/${slotId}`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );

      const options = {
        key: "rzp_test_SDFrX0ULmLz84m", // replace with your Razorpay TEST key
        amount: res.data.amount,
        currency: "INR",
        order_id: res.data.orderId,
        name: "Sportify Turf",
        description: `Booking for ${slotInfo.date} at ${slotInfo.time}`,
        theme: {
          color: "#10b981"
        },

        handler: async function (response) {
          // 2️⃣ Verify payment
          await api.post(
            "/slots/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              slotId
            },
            {
              headers: {
                Authorization: token
              }
            }
          );

          showToast("Payment successful & slot booked! 🎉", "success");
          fetchSlots();
        },
        modal: {
          ondismiss: function() {
            showToast("Payment cancelled", "error");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Logged out successfully", "success");
    setTimeout(() => navigate("/login"), 1500);
  };

  // Filter slots
  const filteredSlots = slots.filter(slot => {
    const statusMatch = filterStatus === "all" || slot.status === filterStatus;
    const dateMatch = !selectedDate || slot.date === selectedDate;
    return statusMatch && dateMatch;
  });

  // Get unique dates for filter
  const uniqueDates = [...new Set(slots.map(slot => slot.date))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-toast-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border-2 ${
            toast.type === "success" 
              ? "bg-green-500/95 border-green-400 text-white" 
              : "bg-red-500/95 border-red-400 text-white"
          }`}>
            <span className="text-2xl">
              {toast.type === "success" ? "✓" : "⚠️"}
            </span>
            <p className="font-semibold text-base">{toast.message}</p>
            <button 
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏏</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Sportify Turf</h1>
                <p className="text-green-100 text-sm">Book Your Slot</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-semibold"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-all duration-300 text-sm font-semibold shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all duration-300 text-gray-800 font-medium"
              >
                <option value="all">All Slots</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all duration-300 text-gray-800 font-medium"
              >
                <option value="">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setSelectedDate("");
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
            <p className="text-white text-xl font-semibold">Loading slots...</p>
          </div>
        )}

        {/* Slots Grid */}
        {!loading && (
          <>
            {filteredSlots.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-white text-xl font-semibold mb-2">No slots found</p>
                <p className="text-green-100">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up"
                  >
                    {/* Card Header */}
                    <div className={`p-4 ${
                      slot.status === "available" 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📅</span>
                          <span className="text-white font-bold text-lg">{slot.date}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          slot.status === "available" 
                            ? "bg-white text-green-600" 
                            : "bg-white/20 text-white"
                        }`}>
                          {slot.status === "available" ? "Available" : "Booked"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⏰</span>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Time Slot</p>
                            <p className="text-xl font-bold text-gray-800">{slot.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💰</span>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Price</p>
                            <p className="text-xl font-bold text-green-600">
                              ₹{slot.price || "500"}
                            </p>
                          </div>
                        </div>

                        {slot.status === "available" ? (
                          <button
                            onClick={() => payAndBook(slot._id, { date: slot.date, time: slot.time })}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 mt-4"
                          >
                            Pay & Book Now
                          </button>
                        ) : (
                          <div className="w-full py-3 bg-gray-200 text-gray-500 font-bold rounded-xl text-center mt-4">
                            Already Booked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold text-lg mb-2">Instant Confirmation</h3>
            <p className="text-green-100 text-sm">Get instant booking confirmation</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-white font-bold text-lg mb-2">Secure Payment</h3>
            <p className="text-green-100 text-sm">100% safe and encrypted</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-bold text-lg mb-2">Premium Turfs</h3>
            <p className="text-green-100 text-sm">Best quality maintained</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toast-in {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
          }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in { animation: toast-in 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default Slots;