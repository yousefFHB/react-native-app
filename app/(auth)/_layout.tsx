import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import "@/global.css";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  // If already signed in, redirect away from auth screens
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
