import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { getPortfolioItemById, type PortfolioItem } from "@/lib/adminStorage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  public: "공공기관",
  enterprise: "기업",
  research: "연구기관",
  manufacturing: "제조업",
};

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        const projectData = await getPortfolioItemById(parseInt(id));
        if (projectData) {
          setProject(projectData);
        }
      };
      loadProject();
    }
  }, [id]);

  if (!project) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="text-muted-foreground mb-4">프로젝트를 찾을 수 없습니다.</p>
          <Button asChild>
            <Link to="/portfolio">포트폴리오로 돌아가기</Link>
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
              {categoryLabels[project.category] || project.category}
            </span>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-primary-foreground/80">
              <span className="text-lg font-medium">{project.client}</span>
              <span>·</span>
              <span>{project.year}년</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <article className="max-w-4xl mx-auto">
            {project.imageUrl && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="text-lg text-foreground leading-relaxed mb-8">
                {project.description}
              </div>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  등록일: {format(new Date(project.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                </div>
                {project.updatedAt !== project.createdAt && (
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    수정일: {format(new Date(project.updatedAt), "yyyy년 MM월 dd일", { locale: ko })}
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Back to Portfolio */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild size="lg">
              <Link to="/portfolio">
                <ArrowLeft className="h-4 w-4 mr-2" />
                포트폴리오 목록으로
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
