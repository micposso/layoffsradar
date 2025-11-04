import { Link, useLocation } from "wouter";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Analytics", href: "/analytics" },
    { name: "Subscribe", href: "/subscribe" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover-elevate" data-testid="link-logo">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">L</span>
            </div>
            <span className="hidden text-lg font-semibold sm:inline-block">
              LayoffsRADAR
            </span>
          </Link>

          <nav className="hidden gap-1 md:flex" data-testid="nav-main">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`link-nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="font-medium"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  data-testid="button-user-menu"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user.profileImageUrl || undefined}
                      alt={user.email || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/import">
                    <span className="cursor-pointer" data-testid="menu-item-admin-import">
                      Import Data
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="cursor-pointer" data-testid="menu-item-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              asChild
              className="hidden md:inline-flex"
              data-testid="button-login"
            >
              <a href="/api/login">Log in</a>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden bg-background">
          <nav className="container flex flex-col gap-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="justify-start w-full"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
