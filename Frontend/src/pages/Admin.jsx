import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });
  
  // Create slot states
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [creatingSlot, setCreatingSlot] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Please login as admin", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const res = await api.get("/slots/all-bookings", {
        headers: {
          Authorization: token
        }
      });

      setBookings(res.data);

      // Calculate stats
      const total = res.data.length;
      const pending = res.data.filter(b => b.status === "pending").length;
      const confirmed = res.data.filter(b => b.status === "confirmed").length;
      const cancelled = res.data.filter(b => b.status === "cancelled").length;
      
      setStats({ total, pending, confirmed, cancelled });

    } catch (err) {
      showToast(err.response?.data?.message || "Not authorized or server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create new slot
  const createSlot = async () => {
    if (!date || !time) {
      showToast("Please enter both date and time", "error");
      return;
    }

    setCreatingSlot(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/slots/create",
        { date, time },
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Slot created successfully! 🎉", "success");
      setDate("");
      setTime("");
      loadBookings();
    } catch (err) {
      showToast(err.response?.data?.message || "Error creating slot", "error");
    } finally {
      setCreatingSlot(false);
    }
  };

  const confirmBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/slots/confirm/${id}`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );

      showToast("Booking confirmed successfully! 🎉", "success");
      loadBookings();

    } catch (err) {
      showToast(err.response?.data?.message || "Error confirming booking", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Logged out successfully", "success");
    setTimeout(() => navigate("/login"), 1500);
  };

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === "all" || booking.status === filterStatus;
    const searchMatch = 
      !searchQuery ||
      booking.bookedBy?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.time.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

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
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Admin Panel</h1>
                <p className="text-green-100 text-sm">Manage Slots & Bookings</p>
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

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-black text-gray-800 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 font-semibold">Total Bookings</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-black text-orange-500 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600 font-semibold">Pending</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="text-3xl mb-2">✓</div>
            <div className="text-3xl font-black text-green-500 mb-1">{stats.confirmed}</div>
            <div className="text-sm text-gray-600 font-semibold">Confirmed</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="text-3xl mb-2">✕</div>
            <div className="text-3xl font-black text-red-500 mb-1">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 font-semibold">Cancelled</div>
          </div>
        </div>

        {/* Create Slot Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Create New Slot</h2>
              <p className="text-gray-600 text-sm">Add available time slots for booking</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all duration-300 text-gray-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 6PM - 7PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all duration-300 text-gray-800"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={createSlot}
                disabled={creatingSlot}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {creatingSlot ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>➕</span>
                    Create Slot
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Bookings
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by email, date, or time..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all duration-300 text-gray-800"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-all duration-300 text-gray-800 font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
            <p className="text-white text-xl font-semibold">Loading bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-white text-xl font-semibold mb-2">
                  {bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}
                </p>
                <p className="text-green-100">
                  {bookings.length === 0 ? "Bookings will appear here once customers make reservations" : "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 transform hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  >
                    <div className="p-6">
                      <div className="grid md:grid-cols-5 gap-6 items-center">
                        {/* Date & Time */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">📅</span>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Date</p>
                              <p className="text-lg font-bold text-gray-800">{booking.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">⏰</span>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Time</p>
                              <p className="text-lg font-bold text-gray-800">{booking.time}</p>
                            </div>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👤</span>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Booked By</p>
                              <p className="text-sm font-bold text-gray-800">
                                {booking.bookedBy?.email || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ID: {booking._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status & Action */}
                        <div className="text-center md:text-right">
                          <div className="mb-3">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                              booking.status === "confirmed" 
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {booking.status === "confirmed" && "✓ Confirmed"}
                              {booking.status === "pending" && "⏳ Pending"}
                              {booking.status === "cancelled" && "✕ Cancelled"}
                            </span>
                          </div>

                          {booking.status === "pending" && (
                            <button
                              onClick={() => confirmBooking(booking._id)}
                              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 text-sm"
                            >
                              Confirm Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="text-white font-bold text-lg mb-2">Auto Refresh</h3>
            <p className="text-green-100 text-sm">Bookings update in real-time</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-bold text-lg mb-2">Analytics</h3>
            <p className="text-green-100 text-sm">Track booking statistics</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold text-lg mb-2">Quick Actions</h3>
            <p className="text-green-100 text-sm">Manage with one click</p>
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

export default Admin;