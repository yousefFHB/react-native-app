import { icons } from "./icons";

export const tabs: AppTab[] = [
    { name: "index", title: "خانه", icon: icons.home },
    { name: "subscriptions", title: "اشتراک‌ها", icon: icons.wallet },
    { name: "insights", title: "تحلیل‌ها", icon: icons.activity },
    { name: "settings", title: "تنظیمات", icon: icons.setting },
];

export const HOME_USER = {
    name: "یوسف فرح بخش",
};

export const HOME_BALANCE = {
    amount: 2481640,
    nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

export const UPCOMING_SUBSCRIPTIONS: UpcomingSubscription[] = [
    {
        id: "spotify",
        icon: icons.spotify,
        name: "Spotify",
        price: 500000,
        currency: "IRR",
        daysLeft: 2,
    },
    {
        id: "notion",
        icon: icons.notion,
        name: "Notion",
        price: 12.0,
        currency: "IRR",
        daysLeft: 4,
    },
    {
        id: "figma",
        icon: icons.figma,
        name: "Figma",
        price: 200000,
        currency: "IRR",
        daysLeft: 6,
    },
];

export const HOME_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "adobe-creative-cloud",
    icon: icons.adobe,
    name: "Adobe Creative Cloud",
    plan: "پلن تیمی",
    category: "طراحی",
    paymentMethod: "کارت بانک ملت ",
    status: "فعال",
    startDate: "2025-03-20T10:00:00.000Z",
    price: 77.49,
    currency: "USD",
    billing: "ماهانه",
    renewalDate: "2026-03-20T10:00:00.000Z",
    color: "#f5c542",
  },
  {
    id: "github-pro",
    icon: icons.github,
    name: "GitHub Pro",
    plan: "توسعه‌دهنده",
    category: "ابزارهای توسعه",
    paymentMethod: "دیجی‌پی  ",
    status: "فعال",
    startDate: "2024-11-24T10:00:00.000Z",
    price: 9.99,
    currency: "USD",
    billing: "ماهانه",
    renewalDate: "2026-03-24T10:00:00.000Z",
    color: "#e8def8",
  },
  {
    id: "claude-pro",
    icon: icons.claude,
    name: "Claude Pro",
    plan: "پلن حرفه‌ای",
    category: "ابزارهای هوش مصنوعی",
    paymentMethod: "کارت بانک سامان  ",
    status: "توقف",
    startDate: "2025-06-27T10:00:00.000Z",
    price: 20.0,
    currency: "USD",
    billing: "ماهانه",
    renewalDate: "2026-03-27T10:00:00.000Z",
    color: "#b8d4e3",
  },
  {
    id: "canva-pro",
    icon: icons.canva,
    name: "Canva Pro",
    plan: "دسترسی سالانه",
    category: "طراحی",
    paymentMethod: "اسنپ‌پی  ",
    status: "کنسل شده",
    startDate: "2024-04-02T10:00:00.000Z",
    price: 119.99,
    currency: "USD",
    billing: "سالانه",
    renewalDate: "2026-04-02T10:00:00.000Z",
    color: "#b8e8d0",
  },
];