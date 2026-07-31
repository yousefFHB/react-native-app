import { useSignIn } from "@clerk/expo/legacy";
import clsx from "clsx";
import { Link } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import LogoImg from "../../assets/images/Logo.png";

const SafeAreaView = styled(RNSafeAreaView);

/** Map Clerk error codes to Farsi user-friendly messages */
function clerkErrorToFarsi(code: string, message: string): string {
  const map: Record<string, string> = {
    form_identifier_not_found: "حسابی با این ایمیل یافت نشد",
    form_password_incorrect: "رمز عبور اشتباه است",
    form_param_format_invalid: "فرمت ایمیل نامعتبر است",
    too_many_requests: "تعداد درخواست‌ها زیاد است. کمی صبر کنید",
    strategy_for_user_invalid:
      "روش ورود پشتیبانی نمی‌شود. لطفاً با ایمیل و رمز وارد شوید",
  };
  return map[code] || message || "خطایی رخ داد. لطفاً دوباره تلاش کنید";
}

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  /** Client-side validation */
  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!emailAddress.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.email = "فرمت ایمیل نامعتبر است";
    }
    if (!password) {
      newErrors.password = "رمز عبور الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /** Handle sign-in with email + password */
  async function handleSignIn() {
    if (!isLoaded || !signIn) return;
    if (!validate()) return;

    setIsLoading(true);
    setGlobalError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        // AuthGuard will redirect to home
      } else {
        setGlobalError("ورود کامل نشد. لطفاً دوباره تلاش کنید");
      }
    } catch (err: any) {
      const clerkErrors = err?.errors;
      if (clerkErrors?.length) {
        setGlobalError(
          clerkErrorToFarsi(clerkErrors[0].code, clerkErrors[0].longMessage),
        );
      } else {
        setGlobalError("خطایی رخ داد. لطفاً دوباره تلاش کنید");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isFormValid = emailAddress.trim() && password;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ direction: "rtl" }} className="auth-content">
            {/* Brand */}
            <View className="auth-brand-block">
              <View className="flex-row items-center gap-2">
                <View className="rounded-xl overflow-hidden bg-primary">
                  <Image
                    source={LogoImg}
                    style={{ width: 50, height: 50, resizeMode: "cover" }}
                  />
                </View>
                <View>
                  <Text className="auth-wordmark">اشتراک پی</Text>
                  <Text className="auth-wordmark-sub">مدیریت اشتراک‌ها</Text>
                </View>
              </View>
              <Text className="auth-title">خوش آمدید</Text>
              <Text className="auth-subtitle">
                برای مدیریت اشتراک‌ها وارد حساب خود شوید
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {globalError ? (
                  <View className="auth-error-banner">
                    <Text className="auth-error-banner-text">
                      {globalError}
                    </Text>
                  </View>
                ) : null}

                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label" style={{ color: "#fff" }}>
                    ایمیل
                  </Text>
                  <TextInput
                    className='w-full rounded-2xl border border-border bg-background px-4 py-4'
                    value={emailAddress}
                    onChangeText={(text) => {
                      setEmailAddress(text);
                      if (errors.email)
                        setErrors((e) => ({ ...e, email: "" }));
                    }}
                    placeholder="email@example.com"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email ? (
                    <Text className="auth-error">{errors.email}</Text>
                  ) : null}
                </View>

                {/* Password */}
                <View className="auth-field">
                  <Text className="auth-label" style={{ color: "#fff" }}>
                    رمز عبور
                  </Text>
                  <View className="auth-input-wrap">
                    <TextInput
                      className='w-full rounded-2xl border border-border bg-background px-4 py-4'
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password)
                          setErrors((e) => ({ ...e, password: "" }));
                      }}
                      placeholder="رمز عبور خود را وارد کنید"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <Pressable
                      className="auth-password-toggle"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text className="auth-password-toggle-text">
                        {showPassword ? "مخفی" : "نمایش"}
                      </Text>
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text className="auth-error">{errors.password}</Text>
                  ) : null}
                </View>

                {/* Submit */}
                <Pressable
                  className={clsx(
                    "auth-button",
                    (isLoading || !isFormValid) && "auth-button-disabled",
                  )}
                  onPress={handleSignIn}
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff9e3" />
                  ) : (
                    <Text className="auth-button-text-light">ورود</Text>
                  )}
                </Pressable>
              </View>

              {/* Divider */}
              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">یا</Text>
                <View className="auth-divider-line" />
              </View>

              {/* Link to Sign Up */}
              <View className="auth-link-row">
                <Text className="auth-link-copy">حساب ندارید؟</Text>
                <Link href="/(auth)/sign-up">
                  <Text className="auth-link">ثبت‌نام کنید</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}