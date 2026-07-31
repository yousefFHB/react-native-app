
import "@/global.css";
import { useAuth, useUser } from "@clerk/expo";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  UserCircle,
} from "lucide-react-native";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* -----------------------------
     User information
  ----------------------------- */

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username || "کاربر";

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const username = user?.username
    ? `@${user.username}`
    : "تنظیم نشده";

  const userId = user?.id ?? "—";

  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : images.avatar;

  const isEmailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "—";

  const lastSignIn = user?.lastSignInAt
    ? new Date(user.lastSignInAt).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "—";

  /* -----------------------------
     Logout
  ----------------------------- */

  async function handleLogout() {
    Alert.alert(
      "خروج از حساب",
      "آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟",
      [
        {
          text: "لغو",
          style: "cancel",
        },
        {
          text: "خروج",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await signOut();
            } catch (error) {
              console.error("Error signing out:", error);

              Alert.alert(
                "خطا",
                "خروج از حساب انجام نشد. لطفاً دوباره تلاش کنید.",
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
    );
  }

  /* -----------------------------
     Copy user ID
  ----------------------------- */

  async function handleCopyUserId() {
    // Clipboard can be added later if needed.
    Alert.alert("شناسه کاربر", userId);
  }

  /* -----------------------------
     Loading state
  ----------------------------- */

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 font-vazir text-white">
          در حال دریافت اطلاعات حساب...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 bg-background"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* --------------------------------
            Header
        -------------------------------- */}

        <View className="mb-7">
          <Text className="text-3xl font-vazir font-bold text-white">
            تنظیمات
          </Text>

          <Text className="mt-1 text-sm font-vazir text-white">
            مدیریت حساب و اطلاعات کاربری
          </Text>
        </View>

        {/* --------------------------------
            Profile Header
        -------------------------------- */}

        <View className="mb-6 overflow-hidden rounded-3xl border border-border bg-card">
          <View className="items-center px-5 py-7">
            <View className="mb-4 rounded-full border-4 border-background">
              <Image
                source={avatarSource}
                className="h-24 w-24 rounded-full"
                resizeMode="cover"
              />
            </View>

            <Text className="text-xl font-vazir font-bold text-white">
              {displayName}
            </Text>

            {email ? (
              <Text className="mt-1 text-sm font-vazir text-white">
                {email}
              </Text>
            ) : null}

            {user?.username ? (
              <View className="mt-3 rounded-full bg-primary/10 px-4 py-1.5">
                <Text className="text-xs font-vazir font-semibold text-white">
                  {username}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* --------------------------------
            Account Information
        -------------------------------- */}

        <SectionTitle
          icon={<UserCircle size={18} />}
          title="اطلاعات حساب"
        />

        <View className="mb-6 overflow-hidden rounded-2xl border border-border bg-card/50">
          <InfoRow
            icon={<User size={19} />}
            label="نام"
            value={displayName}
          />

          <Divider />

          <InfoRow
            icon={<Mail size={19} />}
            label="ایمیل"
            value={email || "تنظیم نشده"}
            rightContent={
              email ? (
                <View className="flex-row items-center gap-1 rounded-full bg-green-700/30 px-2.5 py-1">
                  <CheckCircle2 size={13} color="#22c55e" />

                  <Text className="font-vazir text-[10px] font-semibold text-green-800">
                    {isEmailVerified ? "تأیید شده" : "تأیید نشده"}
                  </Text>
                </View>
              ) : null
            }
          />

          <Divider />

          <InfoRow
            icon={<ShieldCheck size={19} />}
            label="نام کاربری"
            value={username}
          />
        </View>

        {/* --------------------------------
            Account Activity
        -------------------------------- */}

        <SectionTitle
          icon={<Clock3 size={18} />}
          title="فعالیت حساب"
        />

        <View className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          <InfoRow
            icon={<CalendarDays size={19} />}
            label="تاریخ عضویت"
            value={createdAt}
          />

          <Divider />

          <InfoRow
            icon={<Clock3 size={19} />}
            label="آخرین ورود"
            value={lastSignIn}
          />
        </View>

        {/* --------------------------------
            Clerk Information
        -------------------------------- */}

        <SectionTitle
          icon={<ShieldCheck size={18} />}
          title="شناسه حساب"
        />

        <View className="mb-6 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 font-vazir text-xs text-white">
            شناسه کاربر Clerk
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="font-vazir text-xs text-white"
              >
                {userId}
              </Text>
            </View>

            <Pressable
              onPress={handleCopyUserId}
              className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10 active:opacity-70"
            >
              <Copy size={17} />
            </Pressable>
          </View>
        </View>

        {/* --------------------------------
            Account Actions
        -------------------------------- */}

        <SectionTitle
          icon={<UserCircle size={18} />}
          title="حساب کاربری"
        />

        <View className="mb-7 overflow-hidden rounded-2xl border border-border bg-card">
          <Pressable
            onPress={() =>
              Alert.alert(
                "ویرایش پروفایل",
                "برای ویرایش اطلاعات پروفایل می‌توانیم صفحه مدیریت پروفایل Clerk را اضافه کنیم.",
              )
            }
            className="flex-row items-center px-4 py-4 active:bg-muted/50"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserCircle size={19} color="#fff9e3" />
            </View>

            <View className="mr-3 flex-1">
              <Text className="font-vazir text-sm font-semibold text-white">
                ویرایش پروفایل
              </Text>

              <Text className="mt-0.5 font-vazir text-xs text-white">
                تغییر نام، تصویر و اطلاعات حساب
              </Text>
            </View>

            <ChevronLeft size={18} />
          </Pressable>
        </View>

        {/* --------------------------------
            Logout
        -------------------------------- */}

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="flex-row items-center justify-center gap-2 rounded-2xl border border-redBLaze/40 bg-redBLaze/10 px-5 py-4 active:opacity-70"
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#c1121f" />
          ) : (
            <>
              <LogOut size={19} color="#c1121f" />

              <Text className="font-vazir text-base font-bold text-redBLaze">
                خروج از حساب کاربری
              </Text>
            </>
          )}
        </Pressable>

        {/* --------------------------------
            Footer
        -------------------------------- */}

        <Text className="mt-6 text-center font-vazir text-[10px] text-white">
          اشتراک‌پِی • مدیریت اشتراک‌ها
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   Reusable Components
========================================================= */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View className="mb-3 flex-row items-center gap-2">
      {icon}

      <Text className="font-vazir text-sm  text-primary">
        {title}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="mx-4 h-px bg-white" />;
}

function InfoRow({
  icon,
  label,
  value,
  rightContent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  rightContent?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="h-10 w-10 items-center bg-cream justify-center rounded-xl">
        {icon}
      </View>

      <View className="mr-3 flex-1">
        <Text className="font-vazir text-xs text-white">
          {label}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 font-vazir text-sm  text-white"
        >
          {value}
        </Text>
      </View>

      {rightContent}
    </View>
  );
}

