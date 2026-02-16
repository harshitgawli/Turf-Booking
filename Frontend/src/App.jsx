import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Slots from "./pages/Slots";
import Admin from "./pages/Admin";
import Hero from "./pages/Hero";
import BookingPending from "./pages/BookingPending";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking-pending" element={<BookingPending />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
