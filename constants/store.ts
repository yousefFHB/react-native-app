import { create } from "zustand";
import { HOME_SUBSCRIPTIONS } from "./data";

interface SubscriptionStore {
  subscriptions: any[];
  addSubscription: (sub: any) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (sub) =>
    set((state) => ({ subscriptions: [sub, ...state.subscriptions] })),
}));
