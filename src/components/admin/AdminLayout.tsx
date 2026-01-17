import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Bell,
  Newspaper,
  Mail
} from "lucide-react";
import { clearAuthToken } from "@/lib/adminStorage";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", path: "/admin" },
  { icon: Briefcase, label: "포트폴리오", path: "/admin/portfolio" },
  { icon: FileText, label: "블로그", path: "/admin/blog" },
  { icon: Bell, label: "공지사항", path: "/admin/announcements" },
  { icon: Newspaper, label: "보도자료", path: "/admin/press" },
  { icon: MessageSquare, label: "문의글", path: "/admin/inquiries" },
  { icon: Mail, label: "구독자 관리", path: "/admin/newsletter" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/admin" className="text-xl font-bold text-foreground">
                관리자 페이지
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                홈페이지로
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${mobileMenuOpen ? "block" : "hidden"} md:block w-64 flex-shrink-0`}>
            <nav className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
