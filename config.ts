export const API_URL =
  typeof window !== "undefined"
    ? "http://127.0.0.1:5000/api"   // Expo Web
    : "http://10.0.2.2:5000/api";  // Android emulator (future)
