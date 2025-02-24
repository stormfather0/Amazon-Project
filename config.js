const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal 
  ? "http://localhost:5000"  // Local API for development
  : "https://amazon-project-sta4.onrender.com";  // Deployed API for GitHub