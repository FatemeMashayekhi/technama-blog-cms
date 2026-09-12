export type ArticleStatus = "published" | "draft" | "review";

export type Article = {
  id: number;
  title: string;
  author: { name: string; initials: string; color: string };
  category: string;
  status: ArticleStatus;
  views: string;
  date: string;
};

export const articles: Article[] = [
  {
    id: 1,
    title: "آینده هوش مصنوعی مولد در توسعه نرم‌افزار",
    author: {
      name: "مریم احمدی",
      initials: "ما",
      color: "bg-[#dbe8f2] text-[#254e6e]",
    },
    category: "هوش مصنوعی",
    status: "published",
    views: "۱۲٬۴۸۰",
    date: "۱۸ شهریور ۱۴۰۵",
  },
  {
    id: 2,
    title: "چرا معماری Server Components اهمیت دارد؟",
    author: {
      name: "علی رضایی",
      initials: "عر",
      color: "bg-[#e8e2f2] text-[#604b78]",
    },
    category: "توسعه وب",
    status: "review",
    views: "—",
    date: "۱۷ شهریور ۱۴۰۵",
  },
  {
    id: 3,
    title: "بررسی روندهای جدید طراحی رابط کاربری",
    author: {
      name: "سارا اکبری",
      initials: "سا",
      color: "bg-[#f4e5d8] text-[#82552f]",
    },
    category: "طراحی محصول",
    status: "published",
    views: "۸٬۹۲۰",
    date: "۱۵ شهریور ۱۴۰۵",
  },
  {
    id: 4,
    title: "TypeScript؛ از تایپ ساده تا معماری مقیاس‌پذیر",
    author: {
      name: "کیان نادری",
      initials: "کن",
      color: "bg-[#ddefe9] text-[#30665c]",
    },
    category: "برنامه‌نویسی",
    status: "draft",
    views: "—",
    date: "۱۴ شهریور ۱۴۰۵",
  },
];

export const chartData = [
  42, 51, 45, 62, 58, 66, 81, 74, 87, 79, 92, 104, 99, 112, 120, 108, 126, 139,
  132, 148, 142, 154, 167, 158, 176, 184, 172, 191, 202, 214,
];

export const activities = [
  {
    id: 1,
    name: "مریم",
    avatar: "م",
    color: "bg-[#dbe8f2] text-[#254e6e]",
    action: "مقاله «آینده هوش مصنوعی مولد» را منتشر کرد.",
    time: "۱۲ دقیقه پیش",
  },
  {
    id: 2,
    name: "علی",
    avatar: "ع",
    color: "bg-[#e8e2f2] text-[#604b78]",
    action: "مقاله «معماری Server Components» را برای بررسی ارسال کرد.",
    time: "۴۵ دقیقه پیش",
  },
  {
    id: 3,
    name: "سارا",
    avatar: "س",
    color: "bg-[#f4e5d8] text-[#82552f]",
    action: "۳ تصویر جدید به کتابخانه رسانه اضافه کرد.",
    time: "۲ ساعت پیش",
  },
  {
    id: 4,
    name: "کیان",
    avatar: "ک",
    color: "bg-[#ddefe9] text-[#30665c]",
    action: "پیش‌نویس راهنمای TypeScript را به‌روزرسانی کرد.",
    time: "دیروز، ۱۸:۲۰",
  },
];
