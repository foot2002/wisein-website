import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ExternalLink, Calendar } from "lucide-react";
import { getPressReleases } from "@/lib/adminStorage";

export default function Press() {
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPressReleases = async () => {
      try {
        setIsLoading(true);
        const data = await getPressReleases();
        console.log('보도자료 데이터:', data); // 디버깅용
        // Data is already ordered by DB: sort_order ASC, published_at DESC
        setPressReleases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('보도자료 로딩 오류:', error);
        setPressReleases([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPressReleases();
  }, []);
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">PRESS & MEDIA</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              보도자료
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              와이즈인컴퍼니의 최신 소식과 보도자료를 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-border">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground w-20">번호</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground">제목</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-foreground w-32">출처</th>
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
                  ) : pressReleases.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-muted-foreground">
                        등록된 보도자료가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pressReleases.map((release, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <span className="text-foreground/60 font-medium">{pressReleases.length - index}</span>
                      </td>
                      <td className="px-8 py-5">
                        <a
                          href={release.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-accent transition-colors flex items-center gap-3 group/link"
                        >
                          <ExternalLink className="h-4 w-4 text-accent/60 flex-shrink-0" />
                          <span className="font-medium group-hover/link:text-accent">{release.title}</span>
                        </a>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                          {release.source}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{release.date}</span>
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
