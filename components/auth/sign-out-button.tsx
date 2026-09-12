"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";

export function SignOutButton() {
  return <form action={signOut}><button aria-label="خروج از حساب" title="خروج" className="grid size-10 place-items-center rounded-lg text-(--text-faint) hover:bg-white/10 hover:text-white"><LogOut size={17}/></button></form>;
}
