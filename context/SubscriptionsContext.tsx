import React, { createContext, useContext, useState } from "react";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

interface SubscriptionsContextType {
  subscriptions: any[];
  addSubscription: (sub: any) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(
  undefined
);

export function SubscriptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);

  const addSubscription = (sub: any) => {
    setSubscriptions((prev) => [sub, ...prev]);
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionsProvider"
    );
  }
  return context;
}
