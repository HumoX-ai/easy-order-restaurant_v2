"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ListOrdered,
  LogOut,
  Settings,
  SquareMenu,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/home", label: "Bosh sahifa", icon: <HomeIcon /> },
    {
      href: "/dashboard/orders",
      label: "Buyurtmalar",
      icon: <ListOrdered />,
    },
    {
      href: "/dashboard/menus",
      label: "Menyu boshqaruvi",
      icon: <SquareMenu />,
    },

    {
      href: "/dashboard/settings",
      label: "Sozlamalar",
      icon: <Settings />,
    },

    {
      href: "/dashboard/users",
      label: "Mijozlar",
      icon: <UsersIcon />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard/home") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-[#2a2727] p-4 text-white h-screen w-64 fixed left-0 top-0 hidden md:block">
      <div></div>
      <div className="relative h-full">
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`px-4 py-3 rounded-xl flex gap-2 ${
                  isActive(item.href) ? "bg-[#363232]" : ""
                } hover:bg-[#363232]`}
              >
                {item.icon} {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <Button
          variant="destructive"
          className="absolute flex gap-2 bottom-4 w-full"
          onClick={() => {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            window.location.reload();
          }}
        >
          <LogOut /> Chiqish
        </Button>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8 md:ml-64">{children}</main>
    </div>
  );
}
