"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getClientSession } from "@/lib/client-session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileButton from "./profile-button";

const Navbar = () => {
  const pathname = usePathname();
  const session = getClientSession();

  const NAV_LINKS = [
    {
      label: "Server",
      href: "/server",
    },
    {
      label: "Client",
      href: "/client",
    },
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ];
  return (
    <>
      <Card className="max-w-2xl bg-white w-full py-3.5 px-5 flex justify-between items-center">
        <div>
          <div className="md:space-x-6 space-x-3">
            {NAV_LINKS.map((item, id) => {
              return (
                <Button
                  key={id}
                  size="sm"
                  variant={pathname !== item.href ? "ghost" : "default"}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              );
            })}
          </div>
        </div>
        <ProfileButton imageUrl={session?.image ?? ""} />
      </Card>
    </>
  );
};

export default Navbar;
