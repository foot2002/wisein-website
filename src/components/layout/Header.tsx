import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Business Solutions", href: "/services/business-solutions", description: "AI SaaS & 마케팅 자동화" },
      { label: "Research & Consulting", href: "/services/research-consulting", description: "리서치 & 빅데이터 분석" },
      { label: "Education", href: "/services/education", description: "국비교육 프로그램" },
      { label: "Platform", href: "/services/platform", description: "RichWay 금융 플랫폼" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  {
    label: "About Us",
    href: "/about/overview",
    children: [
      { label: "Company Overview", href: "/about/overview", description: "회사 개요" },
      { label: "Vision & Mission", href: "/about/vision", description: "비전 & 미션" },
      { label: "History", href: "/about/history", description: "연혁" },
      { label: "Press & Media", href: "/about/press", description: "보도자료" },
      { label: "Location", href: "/about/location", description: "오시는 길" },
    ],
  },
  {
    label: "Support",
    href: "/support",
    children: [
      { label: "Contact Us", href: "/support/contact", description: "문의하기" },
      { label: "FAQ", href: "/support/faq", description: "자주 묻는 질문" },
      { label: "Announcements", href: "/support/announcements", description: "공지사항" },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="container flex h-18 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/images/wisein_logo.png" 
            alt="Company Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="w-64 rounded-lg border border-border bg-card p-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-md px-3 py-2.5 transition-colors hover:bg-secondary"
                      >
                        <div className="text-sm font-medium text-foreground">{child.label}</div>
                        {child.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">{child.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button asChild>
            <Link to="/support/contact">문의하기</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-secondary text-primary"
                      : "text-foreground hover:bg-secondary"
                  )}
                  onClick={() => !item.children && setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 px-4">
              <Button asChild className="w-full">
                <Link to="/support/contact" onClick={() => setMobileOpen(false)}>
                  문의하기
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
