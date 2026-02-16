import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

interface RiderStoreProps {
  user: any;
  location: CustomLocation;
  onDuty: boolean;
  setUser: (data: any) => void;
  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  clearRiderData: () => void;
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

export const useRiderStore = create<RiderStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOnDuty: (data) => set({ onDuty: data }),
      clearRiderData: () =>
        set({
          user: null,
          location: null,
          onDuty: false,
        }),
    }),
    {
      name: "rider-store",
      partialize: (state) => ({
        user: state.user,
      }),
      storage: createJSONStorage(() => secureStore),
    }
  )
);
