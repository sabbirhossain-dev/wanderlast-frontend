"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavLink = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/add-destination", label: "Add Destination" },
  // { href: "/admin", label: "Admin" },
];

const authLinks: NavLink[] = [
  // { href: "/profile", label: "Profile", icon: User },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClasses = (href: string, mobile = false) =>
    cn(
      mobile ? "block py-2 text-base" : "text-sm font-medium",
      "transition-colors hover:text-[#2ba5c9]",
      isActive(href)
        ? cn(
            "text-[#2ba5c9]",
            !mobile &&
              "underline decoration-[#2ba5c9] decoration-2 underline-offset-4",
          )
        : "text-foreground",
    );

  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };
  return (
    <header className=" w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="relative flex auto py-4 md:py-6 items-center justify-between px-4 md:px-20">
        <nav className="hidden items-center gap-5 md:flex md:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          aria-label="Wanderlust home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image
            src="/assets/Wanderlast.png"
            alt="Wanderlast"
            width={304}
            height={40}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          {user ? (
            <>
              <Avatar>
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium -ml-4">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="text-red-700 text-sm border border-red-300 py-1 px-3 rounded-md cursor-pointer hover:bg-red-100 transition-colors duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <nav className="hidden items-center gap-5 md:flex md:gap-7">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    linkClasses(link.href),
                    "flex items-center gap-1.5",
                  )}
                >
                  {link.icon ? <link.icon className="h-4 w-4" /> : null}
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-[#2ba5c9] md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="absolute inset-x-0 top-full z-50 flex flex-col border-b border-border bg-background px-4 py-3 shadow-sm md:hidden">
          {[...navLinks, ...authLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                linkClasses(link.href, true),
                "flex items-center gap-2 border-b border-border/50 last:border-b-0",
              )}
            >
              {link.icon ? <link.icon className="h-4 w-4" /> : null}
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export { Navbar };
