const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal 
  ? "http://localhost:5000"  
  : "https://amazon-project-sta4.onrender.com"; 