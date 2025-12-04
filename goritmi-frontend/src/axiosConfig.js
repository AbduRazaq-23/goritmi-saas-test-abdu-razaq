// src/utils/axios.js   (or directly in main.jsx / index.js)
import axios from "axios";

axios.defaults.withCredentials = true; // THIS LINE FIXES EVERYTHING
axios.defaults.credentials = "include"; // extra safety

export default axios;
