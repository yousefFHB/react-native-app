# 📱 Subscription Tracker App

A sleek, modern React Native (Expo) application to keep track of all your active subscriptions, calculate monthly costs, and gain insights into your spending habits. Built with performance and aesthetics in mind.

<p align="center">
  <img src="./assets/githubpics/Home-page.jpg" width="30%" alt="Home Page" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./assets/githubpics/Sign-in.jpg" width="30%" alt="Sign In Page" />
</p>

## ✨ Features

- **Dashboard:** Instantly see your total monthly subscription costs and upcoming renewals.
- **Subscription Management:** Easily add new subscriptions (e.g., Spotify, Adobe, Developer Tools).
- **Insights & Analytics:** Beautiful charts and graphs powered by `react-native-gifted-charts` showing where your money goes.
- **Secure Authentication:** Fully integrated authentication flow using Clerk.
- **Modern UI:** Designed with NativeWind (Tailwind CSS) for a stunning, responsive, and cross-platform user interface.
- **Smooth Animations:** Built-in React Native `LayoutAnimation` and `react-native-reanimated` for delightful micro-interactions.
- **Global State:** Uses Zustand for blazing fast and effortless state management.

## 🛠️ Tech Stack

- **Framework:** React Native with Expo Router
- **Styling:** NativeWind (TailwindCSS for React Native)
- **State Management:** Zustand
- **Authentication:** Clerk (`@clerk/expo`)
- **Charts:** `react-native-gifted-charts`
- **Animations:** React Native Reanimated

## 🔐 Authentication (Clerk)

This project leverages **Clerk** for robust, secure, and seamless authentication. The authentication flow is completely set up out of the box with custom UI screens matching the app's dark premium aesthetic.

### How it works:
- **Sign In / Sign Up:** Dedicated screens allow users to log in or register securely.
- **Protected Routes:** The main app (Tabs) is wrapped in Clerk's `<SignedIn>` and `<SignedOut>` components (via Expo Router's Layout). If a user is not authenticated, they are automatically redirected to the Sign In page.
- **Session Management:** Clerk handles token refreshes, session persistence, and securely caches credentials using `expo-secure-store`.

To make auth work on your local machine, you **must** configure your Clerk API keys (see setup instructions).

## 🚀 Setup & Installation

Follow these instructions to get a local copy up and running.

### Prerequisites
- Node.js (v18 or newer recommended)
- npm, yarn, pnpm, or bun
- Expo Go app on your physical device, or an iOS Simulator / Android Emulator installed.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/subscription-tracker.git
cd subscription-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Clerk (Environment Variables)
You need your own Clerk Publishable Key to run the app.
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) and create a new application.
2. Select the authentication strategies you want (Email/Password, Google, etc.).
3. Copy your **Publishable Key**.
4. Create a `.env` file in the root of your project:
```bash
touch .env
```
5. Add your key to the `.env` file:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here...
```

### 4. Run the Application
Start the Expo development server:
```bash
npx expo start --clear
```

- Press **`i`** to open in iOS Simulator.
- Press **`a`** to open in Android Emulator.
- Or scan the QR code using the **Expo Go** app on your physical device.

## 📂 Project Structure

```text
├── app/                  # Expo Router file-based navigation (Tabs, Auth, Layouts)
├── assets/               # Images, Icons, and Fonts (including Github showcase pics)
├── components/           # Reusable UI components (Modals, Cards, Charts)
├── constants/            # Global constants, Zustand store, Theme configs
├── context/              # React Context providers
├── lib/                  # Utility functions and helper scripts
├── global.css            # NativeWind global stylesheet and design tokens
└── .env                  # Environment variables (Ignored in Git)
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
