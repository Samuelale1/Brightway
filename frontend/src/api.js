// Frontend API configuration


const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// API_BASE_URL is for fetch calls (e.g. http://127.0.0.1:8000/api)
export const API_BASE_URL = rawBaseUrl;

// BASE_URL is for static assets (e.g. http://127.0.0.1:8000)
export const BASE_URL = rawBaseUrl.replace(/\/api$/, "");
