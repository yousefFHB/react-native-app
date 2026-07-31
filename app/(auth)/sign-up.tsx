import { useSignUp } from "@clerk/expo/legacy";
import clsx from "clsx";
import { Link, useRouter } from "expo-router";
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
    form_identifier_exists: "این ایمیل قبلاً ثبت شده است",
    form_password_pwned:
      "این رمز عبور امن نیست. لطفاً رمز دیگری انتخاب کنید",
    form_password_length_too_short: "رمز عبور باید حداقل ۸ کاراکتر باشد",
    form_param_format_invalid: "فرمت ایمیل نامعتبر است",
    form_code_incorrect: "کد وارد شده اشتباه است",
    verification_expired: "کد تایید منقضی شده. لطفاً کد جدید دریافت کنید",
    too_many_requests: "تعداد درخواست‌ها زیاد است. کمی صبر کنید",
  };
  return map[code] || message || "خطایی رخ داد. لطفاً دوباره تلاش کنید";
}

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  /** Client-side validation */
  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    }
    if (!emailAddress.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.email = "فرمت ایمیل نامعتبر است";
    }
    if (!password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /** Step 1: Create sign-up + send email code */
  async function handleSignUp() {
    if (!isLoaded || !signUp) return;
    if (!validate()) return;

    setIsLoading(true);
    setGlobalError("");

    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
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

  /** Step 2: Verify the email code */
  async function handleVerify() {
    if (!isLoaded || !signUp) return;
    if (!code.trim()) {
      setErrors({ code: "کد تایید را وارد کنید" });
      return;
    }

    setIsLoading(true);
    setGlobalError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        // AuthGuard will redirect to home
      } else {
        setGlobalError("تایید کامل نشد. لطفاً دوباره تلاش کنید");
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

  /** Resend the verification email code */
  async function handleResend() {
    if (!isLoaded || !signUp) return;

    setGlobalError("");
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setGlobalError("");
    } catch (err: any) {
      const clerkErrors = err?.errors;
      if (clerkErrors?.length) {
        setGlobalError(
          clerkErrorToFarsi(clerkErrors[0].code, clerkErrors[0].longMessage),
        );
      }
    }
  }

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    emailAddress.trim() &&
    password.length >= 8;

  // ─── Verification Screen ─────────────────────────────────
  if (isVerifying) {
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
                <View className="auth-logo-wrap">
                  <View className="rounded-xl overflow-hidden bg-primary">
                    <Image
                      source={LogoImg}
                      style={{ width: 50, height: 50, resizeMode: "cover" }}
                    />
                  </View>
                  <View>
                    <Text className="auth-wordmark">اشتراک‌پِی</Text>
                    <Text className="auth-wordmark-sub">
                      مدیریت اشتراک‌ها
                    </Text>
                  </View>
                </View>
                <Text className="auth-title">تایید ایمیل</Text>
                <Text className="auth-subtitle">
                  کد ۶ رقمی ارسال شده به {emailAddress} را وارد کنید
                </Text>
              </View>

              {/* Verification Card */}
              <View className="auth-card">
                <View className="auth-form">
                  {globalError ? (
                    <View className="auth-error-banner">
                      <Text className="auth-error-banner-text">
                        {globalError}
                      </Text>
                    </View>
                  ) : null}

                  <View className="auth-field">
                    <Text className="auth-label" style={{ color: "#fff" }}>
                      کد تایید
                    </Text>
                    <TextInput
                      className='w-full rounded-2xl border border-border bg-background px-4 py-4'
                      value={code}
                      onChangeText={(text) => {
                        setCode(text);
                        setErrors({});
                      }}
                      placeholder="------"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                    {errors.code ? (
                      <Text className="auth-error">{errors.code}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    className={clsx(
                      "auth-button",
                      (isLoading || !code.trim()) && "auth-button-disabled",
                    )}
                    onPress={handleVerify}
                    disabled={isLoading || !code.trim()}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff9e3" />
                    ) : (
                      <Text className="auth-button-text-light">
                        تایید و ورود
                      </Text>
                    )}
                  </Pressable>
                </View>

                <View className="auth-resend-row">
                  <Text className="auth-resend-text">کد دریافت نکردید؟</Text>
                  <Pressable onPress={handleResend}>
                    <Text className="auth-resend-link">ارسال مجدد</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── Sign-Up Form Screen ─────────────────────────────────
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
              <View className="auth-logo-wrap">
                <View className="rounded-xl overflow-hidden bg-primary">
                  <Image
                    source={LogoImg}
                    style={{ width: 50, height: 50, resizeMode: "cover" }}
                  />
                </View>
                <View>
                  <Text className="auth-wordmark">اشتراک‌پِی</Text>
                  <Text className="auth-wordmark-sub">مدیریت اشتراک‌ها</Text>
                </View>
              </View>
              <Text className="auth-title">حساب جدید بسازید</Text>
              <Text className="auth-subtitle">
                با ثبت‌نام، اشتراک‌های خود را هوشمندانه مدیریت کنید
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

                {/* First Name */}
                <View className="auth-field">
                  <Text className="auth-label" style={{ color: "#fff" }}>
                    نام
                  </Text>
                  <TextInput
                    className='w-full rounded-2xl border border-border bg-background px-4 py-4'
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName)
                        setErrors((e) => ({ ...e, firstName: "" }));
                    }}
                    placeholder="نام خود را وارد کنید"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    autoCapitalize="words"
                  />
                  {errors.firstName ? (
                    <Text className="auth-error">{errors.firstName}</Text>
                  ) : null}
                </View>

                {/* Last Name */}
                <View className="auth-field">
                  <Text className="auth-label" style={{ color: "#fff" }}>
                    نام خانوادگی
                  </Text>
                  <TextInput
                    className='w-full rounded-2xl border border-border bg-background px-4 py-4'
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName)
                        setErrors((e) => ({ ...e, lastName: "" }));
                    }}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    autoCapitalize="words"
                  />
                  {errors.lastName ? (
                    <Text className="auth-error">{errors.lastName}</Text>
                  ) : null}
                </View>

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
                      placeholder="حداقل ۸ کاراکتر"
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
                  onPress={handleSignUp}
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff9e3" />
                  ) : (
                    <Text className="auth-button-text-light">ثبت‌نام</Text>
                  )}
                </Pressable>
              </View>

              {/* Divider */}
              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">یا</Text>
                <View className="auth-divider-line" />
              </View>

              {/* Link to Sign In */}
              <View className="auth-link-row">
                <Text className="auth-link-copy">حساب دارید؟</Text>
                <Link href="/(auth)/sign-in">
                  <Text className="auth-link">وارد شوید</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}