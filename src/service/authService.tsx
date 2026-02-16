import axios from "axios";
import { Alert } from "react-native";
import { useRiderStore } from "../store/riderStore";
import { tokenStorage } from "../store/storage";
import { useUserStore } from "../store/userStore";
import { resetAndNavigate } from "../utils/Helpers";
import { BASE_URL } from "./config";

export const signin = async (
  payload: {
    role: "customer" | "rider";
    phone: string;
  },
  updateAccessToken: () => void,
) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setRiderUser } = useRiderStore.getState();
  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, payload);

    if (res.data.user.role === "customer") {
      setUser(res.data.user);
    } else {
      setRiderUser(res.data.user);
    }

    tokenStorage.setItem("access_token", res.data.access_token);
    tokenStorage.setItem("refresh_token", res.data.refresh_token);
    Alert.alert("Info", "OTP verification is currently not implemented.");
    if (res.data.user.role === "customer") {
      resetAndNavigate("/customer/home");
    } else {
      resetAndNavigate("/rider/home");
    }

    updateAccessToken();
  } catch (err: any) {
    Alert.alert("Error occur",err?.response?.data?.msg);
    console.log("Error", err?.response?.data?.msg || "SignIn Error");
  }
};

export const logout = async (disconnect?: () => void) => {
  if (disconnect) {
    disconnect();
  }
  const { clearData } = useUserStore.getState();
  const { clearRiderData } = useRiderStore.getState();

  tokenStorage.removeItem("access_token");
  tokenStorage.removeItem("refresh_token");
  clearRiderData();
  clearData();
  resetAndNavigate("/role");
};
