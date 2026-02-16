import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { createJSONStorage, persist } from "zustand/middleware";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

interface UserStoreProps {
  user: any;
  location: CustomLocation;
  outOfRange: boolean;
  setUser: (data: any) => void;
  setOutOfRange: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  clearData: () => void;
}

const secureStore = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },

  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value ?? null;
  },

  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      outOfRange: false,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOutOfRange: (data) => set({ outOfRange: data }),
      clearData: () => set({ user: null, location: null, outOfRange: false }),
    }),
    {
      name: "user-store", 
      partialize: (state) => ({
        user: state.user, 
      }),
      storage: createJSONStorage(() => secureStore), 
    }
  )
);
