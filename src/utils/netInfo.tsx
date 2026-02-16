import * as Network from "expo-network";

let lastNetworkState = false;

export const checkNetworkAndSync = async (onOnline) => {
  const state = await Network.getNetworkStateAsync();
  const isOnline = state.isConnected && state.isInternetReachable;

  // Detect OFFLINE → ONLINE
  if (!lastNetworkState && isOnline) {
    onOnline();
  }

  lastNetworkState = isOnline;
};
