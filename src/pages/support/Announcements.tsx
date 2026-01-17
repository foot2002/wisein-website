import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Calendar, FileText } from "lucide-react";
import { getAnnouncements } from "@/lib/adminStorage";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await getAnnouncements();
        console.log('공지사항 데이터:', data); // 디버깅용
        // 날짜순으로 정렬 (최신순)
        const sorted = Array.isArray(data) ? [...data].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ) : [];
        setAnnouncements(sorted);
      } catch (error) {
        console.error('공지사항 로딩 오류:', error);
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnnouncements();
  }, []);
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">ANNOUNCEMENTS</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              공지사항
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              와이즈인컴퍼니의 최신 공지사항과 소식을 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-border">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground w-20">번호</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground">제목</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground w-32">카테고리</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground w-40">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-muted-foreground">
                        데이터를 불러오는 중...
                      </td>
                    </tr>
                  ) : announcements.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-muted-foreground">
                        등록된 공지사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    announcements.map((announcement, index) => (
                    <tr
                      key={announcement.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <span className="text-foreground/60 font-medium">{announcements.length - index}</span>
                      </td>
                      <td className="px-8 py-5">
                        <Link
                          to={`/support/announcements/${announcement.id}`}
                          className="flex items-center gap-3 hover:text-accent transition-colors"
                        >
                          <FileText className="h-4 w-4 text-accent/60 flex-shrink-0" />
                          <span className="text-foreground font-medium group-hover:text-accent transition-colors">
                            {announcement.title}
                          </span>
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                          {announcement.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{announcement.date}</span>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
