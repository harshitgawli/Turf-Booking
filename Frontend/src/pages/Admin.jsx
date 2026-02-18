import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [offlineSlotId, setOfflineSlotId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");


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

  // const loadBookings = async () => {
  //   try {
  //     const res = await api.get("/slots/all-bookings", {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     // Sort bookings by date and time
  //     const sortedBookings = res.data.sort((a, b) => {
  //       const dateA = new Date(a.date);
  //       const dateB = new Date(b.date);
  //       if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
        
  //       const timeToMinutes = (timeStr) => {
  //         if (!timeStr) return 0;
  //         const [hours, minutes] = timeStr.split(':').map(Number);
  //         return hours * 60 + minutes;
  //       };
        
  //       return timeToMinutes(a.time) - timeToMinutes(b.time);
  //     });

  //     setBookings(sortedBookings);

  //   } catch (err) {
  //     console.error("Admin load error:", err.response?.data || err.message);
  //     showToast("Failed to load bookings", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadBookings = async () => {
  try {
    // 1️⃣ Load pending + booked
    const bookingRes = await api.get("/slots/all-bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setBookings(bookingRes.data);

    // 2️⃣ Load ALL slots (including available)
    const slotRes = await api.get("/slots");
    setAllSlots(slotRes.data);

  } catch (err) {
    console.error("Admin load error:", err.response?.data || err.message);
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
    if (!date) {
      showToast("Enter date", "error");
      return;
    }

    try {
      await api.post(
        "/slots/create",
        { date }, // Only date required
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDate("");
      loadBookings();

      showToast("New slots created successfully 🎉");

    } catch (err) {
      showToast(err.response?.data?.message || "Error creating slots", "error");
    }
  };

  const handleOfflineBooking = async () => {
  if (!offlineSlotId || !customerName || !customerMobile) {
    showToast("Fill all fields", "error");
    return;
  }

  try {
    await api.post(
      "/slots/offline-book",
      {
        slotId: offlineSlotId,
        name: customerName,
        mobile: customerMobile
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    showToast("Offline booking successful 🎉");

    setOfflineSlotId("");
    setCustomerName("");
    setCustomerMobile("");

    loadBookings();

  } catch (err) {
    showToast(err.response?.data?.message || "Error booking", "error");
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "booked");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 animate-slideIn">
            <div
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl text-white font-semibold flex items-center gap-3 max-w-sm ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
            >
              {toast.type === "success" ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm sm:text-base">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage bookings and slots</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Pending Requests</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{pending.length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">Confirmed Bookings</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{confirmed.length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create Slot Section */}
        <div className="bg-white/80 backdrop-blur-lg p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-10 border border-white/20">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Create Slots</h2>
              <p className="text-xs sm:text-sm text-gray-500">Generate time slots for a specific date</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 max-w-full sm:max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 sm:p-3.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-300"
              />
            </div>
            <button
              onClick={createSlot}
              className="sm:mt-7 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create All Slots</span>
            </button>
          </div>
          <div className="mt-3 sm:mt-4 flex items-start gap-2 bg-purple-50 p-3 rounded-lg">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs sm:text-sm text-purple-800">
              Creates standard time slots (6AM-12AM) for the selected date
            </p>
          </div>
        </div>

        {/* Offline Booking Section */}
<div className="bg-white p-6 rounded-xl shadow mb-10">
  <h2 className="text-lg font-bold mb-4">
    Offline Booking (Cash)
  </h2>

  <div className="grid md:grid-cols-4 gap-4">

    {/* Select Available Slot */}
    <select
      value={offlineSlotId}
      onChange={(e) => setOfflineSlotId(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Available Slot</option>

      {allSlots
        .filter(slot => slot.status === "available")
        .map(slot => (
          <option key={slot._id} value={slot._id}>
            {slot.date} | {slot.time}
          </option>
        ))}
    </select>

    {/* Customer Name */}
    <input
      type="text"
      placeholder="Customer Name"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      className="border p-2 rounded"
    />

    {/* Customer Mobile */}
    <input
      type="text"
      placeholder="Customer Mobile"
      value={customerMobile}
      onChange={(e) => setCustomerMobile(e.target.value)}
      className="border p-2 rounded"
    />

    {/* Book Button */}
    <button
      onClick={handleOfflineBooking}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Book (Cash)
    </button>

  </div>
</div>


        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-semibold text-base sm:text-lg">Loading bookings...</p>
          </div>
        ) : (
          <>
            <Section
              title="Pending Requests"
              data={pending}
              confirm={confirmBooking}
              cancel={cancelBooking}
              isPending={true}
            />

            <Section
              title="Confirmed Bookings"
              data={confirmed}
              isPending={false}
            />
          </>
        )}
      </div>

      {/* Custom Animations */}
      <style >{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

function Section({ title, data, confirm, cancel, isPending }) {
  return (
    <div className="mb-8 sm:mb-10">
      {/* Section Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-white/20">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
            isPending 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : 'bg-gradient-to-br from-green-400 to-emerald-500'
          }`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPending ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {data.length} {data.length === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
        </div>
      </div>
      

      {/* Bookings List */}
      {data.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-white/20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 text-base sm:text-lg font-semibold">No records found</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              {isPending ? 'No pending booking requests at the moment' : 'No confirmed bookings yet'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {data.map((slot, index) => (
            <div
              key={slot._id}
              className="bg-white/80 backdrop-blur-lg p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Booking Info Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">Date</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-gray-800">{slot.date}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">Time</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-gray-800">{slot.time}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">Price</span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">₹{slot.price}/hr</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 sm:space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800">{slot.offlineCustomer?.name ||slot.bookedBy?.name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 break-all">{slot.bookedBy?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <a 
                      href={`tel:${slot.bookedBy?.mobile}`}
                      className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {slot.offlineCustomer?.mobile ||slot.bookedBy?.mobile || "N/A"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Request Code */}
              {slot.requestCode && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Request Code</span>
                  </div>
                  <p className="text-lg sm:text-xl font-mono font-black text-yellow-800">{slot.requestCode}</p>
                </div>
              )}

              {/* Booking Number */}
              {slot.bookingNumber && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Booking Number</span>
                  </div>
                  <p className="text-lg sm:text-xl font-mono font-black text-green-800">{slot.bookingNumber}</p>
                </div>
              )}

              {/* Action Buttons */}
              {slot.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => confirm(slot._id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Confirm</span>
                  </button>
                  <button
                    onClick={() => cancel(slot._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;