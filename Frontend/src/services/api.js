import axios from "axios";

const api = axios.create({
  baseURL: "https://turf-booking-sq7d.onrender.com/api"
});

export default api;
