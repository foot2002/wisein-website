import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Landmark, 
  Factory, 
  GraduationCap,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPortfolioItems, type PortfolioItem } from "@/lib/adminStorage";
import { CountUp } from "@/components/CountUp";

const categories = [
  { id: "all", label: "전체", icon: null },
  { id: "public", label: "공공기관", icon: Landmark },
  { id: "enterprise", label: "기업", icon: Building2 },
  { id: "research", label: "연구기관", icon: GraduationCap },
  { id: "manufacturing", label: "제조업", icon: Factory },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    // 관리자 페이지에서 등록한 포트폴리오 데이터 로드
    const loadData = async () => {
      const portfolioData = await getPortfolioItems();
      // 최신순으로 정렬
      const sorted = [...portfolioData].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(sorted);
    };
    loadData();
  }, []);

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">PORTFOLIO</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              성공적인 프로젝트 사례
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              공공기관과 기업 고객을 위해 수행한 대표 프로젝트들을 소개합니다.
              데이터의 가치를 비즈니스 성과로 연결한 실제 사례를 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 2000, suffix: "+", label: "프로젝트 수행", useCountUp: true },
              { value: 1400, suffix: "+", label: "공공+기업고객", useCountUp: true },
              { value: 95, suffix: "%", label: "고객 만족도", useCountUp: true },
              { value: 80, suffix: "%", label: "재계약률", useCountUp: true },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.useCountUp ? (
                    <>
                      <CountUp 
                        end={stat.value} 
                        duration={5000}
                      />
                      {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
                    </>
                  ) : (
                    <>
                      {stat.value}
                      {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
                    </>
                  )}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border bg-card sticky top-18 z-40">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container">
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.id}`}
                  className="group bg-card rounded-xl p-8 shadow-card hover:shadow-elegant transition-all duration-300 block"
                >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-accent font-medium">
                      {project.client}
                    </span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                
                {project.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {activeCategory === "all" 
                  ? "등록된 포트폴리오가 없습니다." 
                  : "해당 카테고리에 등록된 포트폴리오가 없습니다."}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
