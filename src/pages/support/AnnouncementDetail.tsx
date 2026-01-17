import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { getAnnouncements, type Announcement } from "@/lib/adminStorage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (id) {
      const announcements = getAnnouncements();
      const found = announcements.find((a) => a.id === parseInt(id));
      if (found) {
        setAnnouncement(found);
      }
    }
  }, [id]);

  if (!announcement) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="text-muted-foreground mb-4">공지사항을 찾을 수 없습니다.</p>
          <Button asChild>
            <Link to="/support/announcements">공지사항 목록으로</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-primary-foreground hover:text-primary-foreground/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-4">
              {announcement.category}
            </span>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              {announcement.title}
            </h1>
            <div className="flex items-center gap-4 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{announcement.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <article className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-xl border border-border p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6 text-muted-foreground">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">
                    등록일: {format(new Date(announcement.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                  </span>
                </div>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Back to Announcements */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild size="lg">
              <Link to="/support/announcements">
                <ArrowLeft className="h-4 w-4 mr-2" />
                공지사항 목록으로
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
