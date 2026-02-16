import { Platform } from "react-native";

//dev stage
export const BASE_URL =
  Platform.OS === "ios" ? "http://127.0.0.1:3000" : "http://10.0.2.2:3000";

export const SOCKET_URL =
  Platform.OS === "ios" ? "http://127.0.0.1:3000" : "http://10.0.2.2:3000";

//production stage
// export const BASE_URL= process.env.EXPO_PUBLIC_BASE_URL
// export const SOCKET_URL= process.env.EXPO_PUBLIC_SOCKET_URL
