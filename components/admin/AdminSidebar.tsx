"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CakeSlice,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/registrations", label: "RSVPs", icon: Users },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  email,
  logoutAction,
}: {
  email: string;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gold/20 bg-charcoal text-ivory md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-charcoal font-display text-base text-gold">
          PQ
        </span>
        <div>
          <p className="font-display text-base leading-tight">Cake Runway</p>
          <p className="font-alt text-[0.65rem] tracking-[0.25em] text-gold uppercase">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-alt text-sm whitespace-nowrap transition-colors ${
                active
                  ? "bg-gold/15 text-gold"
                  : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
              }`}
            >
              <Icon size={17} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-ivory/10 px-6 py-5 md:block">
        <p className="truncate font-alt text-xs text-ivory/50">{email}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex items-center gap-2 font-alt text-sm text-ivory/70 transition-colors hover:text-gold"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 flex items-center gap-2 font-alt text-xs text-ivory/40 transition-colors hover:text-gold"
        >
          <CakeSlice size={13} strokeWidth={1.5} />
          View public site
        </Link>
      </div>
    </aside>
  );
}
