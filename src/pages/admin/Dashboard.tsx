import { AdminLayout } from "@/components/admin/AdminLayout";
import { getPortfolioItems, getBlogPosts, getInquiries, getNewsletterSubscribers, resetToDefaultData } from "@/lib/adminStorage";
import { Briefcase, FileText, MessageSquare, Clock, RefreshCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    portfolio: 0,
    blog: 0,
    inquiries: 0,
    pendingInquiries: 0,
    newsletter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const portfolio = await getPortfolioItems();
        const blog = await getBlogPosts();
        const inquiries = await getInquiries();
        const newsletter = await getNewsletterSubscribers();
        
        setStats({
          portfolio: Array.isArray(portfolio) ? portfolio.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          pendingInquiries: Array.isArray(inquiries) ? inquiries.filter((i) => i.status === "pending").length : 0,
          newsletter: Array.isArray(newsletter) ? newsletter.length : 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const statCards = [
    {
      icon: Briefcase,
      label: "포트폴리오",
      value: stats.portfolio,
      href: "/admin/portfolio",
      color: "bg-blue-500",
    },
    {
      icon: FileText,
      label: "블로그",
      value: stats.blog,
      href: "/admin/blog",
      color: "bg-green-500",
    },
    {
      icon: MessageSquare,
      label: "문의글",
      value: stats.inquiries,
      href: "/admin/inquiries",
      color: "bg-purple-500",
    },
    {
      icon: Clock,
      label: "답변 대기",
      value: stats.pendingInquiries,
      href: "/admin/inquiries?status=pending",
      color: "bg-orange-500",
    },
    {
      icon: Mail,
      label: "뉴스레터 구독자",
      value: stats.newsletter,
      href: "/admin/newsletter",
      color: "bg-pink-500",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">대시보드</h1>
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">대시보드</h1>
          <p className="text-muted-foreground">관리자 페이지에 오신 것을 환영합니다.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.href}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/portfolio?new=true"
              className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="font-medium text-foreground mb-1">새 포트폴리오 등록</div>
              <div className="text-sm text-muted-foreground">프로젝트 사례를 추가합니다</div>
            </Link>
            <Link
              to="/admin/blog?new=true"
              className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="font-medium text-foreground mb-1">새 블로그 작성</div>
              <div className="text-sm text-muted-foreground">블로그 포스트를 작성합니다</div>
            </Link>
            <Link
              to="/admin/inquiries"
              className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="font-medium text-foreground mb-1">문의글 확인</div>
              <div className="text-sm text-muted-foreground">새로운 문의를 확인합니다</div>
            </Link>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">데이터 관리</h2>
          <div className="flex flex-col gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground mb-1">목 데이터 초기화</div>
                  <div className="text-sm text-muted-foreground">
                    포트폴리오와 블로그를 목 데이터 10개씩으로 초기화합니다. 기존 데이터는 삭제됩니다.
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("정말로 목 데이터로 초기화하시겠습니까? 기존 데이터는 모두 삭제됩니다.")) {
                      resetToDefaultData();
                      alert("목 데이터로 초기화되었습니다. 페이지를 새로고침하세요.");
                      window.location.reload();
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  목 데이터 초기화
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
