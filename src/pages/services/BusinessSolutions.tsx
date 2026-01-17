import { Layout } from "@/components/layout/Layout";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Survey & Analysis AI SaaS",
    description: "설문조사 설계부터 분석까지 AI가 자동으로 처리하는 올인원 리서치 플랫폼",
    features: [
      "AI 기반 설문 설계",
      "실시간 응답 분석",
      "인사이트 자동 생성",
      "대시보드 리포팅",
    ],
    image: "/images/business01_1.jpg",
  },
  {
    title: "Marketing Automation Solution",
    description: "고객 유입을 위한 마케팅 콘텐츠 생성 자동화 솔루션",
    features: [
      "고객기반 차별화 전략 자동 수립",
      "블로그+쇼츠+SNS 마케팅 콘텐츠 AI 자동화",
      "마케팅 캠페인 자동화",
      "ROI 분석 및 콘텐츠 마케팅 자동 고도화",
    ],
    image: "/images/business01_2.jpg",
  },
];

export default function BusinessSolutions() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">BUSINESS SOLUTIONS</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              AI SaaS & 마케팅 자동화
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              데이터 기반 의사결정을 위한 AI 솔루션과 마케팅 자동화 도구를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* 이미지 - 왼쪽 */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 이미지가 없을 경우 플레이스홀더 표시
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-4xl font-bold text-muted-foreground/30">${service.title}</div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 설명 - 오른쪽 */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-base text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm font-bold text-foreground mb-6">
              맞춤형 솔루션이 필요하신가요?
            </h2>
            <p className="text-muted-foreground mb-10">
              프로젝트에 대해 상담하고 싶으시다면 언제든 연락주세요.
            </p>
            <Button asChild size="xl">
              <Link to="/support/contact">
                상담 문의하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
