import { Layout } from "@/components/layout/Layout";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Research",
    description: "정량/정성 조사 설계부터 현장 조사, 분석까지 토탈 리서치 서비스",
    features: [
      "설문조사",
      "FGI/IDI",
      "패널 운영",
      "리서치 컨설팅",
    ],
    image: `${import.meta.env.BASE_URL}images/business02_1.jpg`,
  },
  {
    title: "Big Data Analysis",
    description: "대용량 데이터 수집, 정제, 분석을 통한 비즈니스 인사이트 도출",
    features: [
      "데이터 수집/정제",
      "통계 분석",
      "머신러닝",
      "시각화",
    ],
    image: `${import.meta.env.BASE_URL}images/business02_2.jpg`,
  },
  {
    title: "Policy & Statistical Analysis",
    description: "공공정책 효과성 분석 및 통계 기반 의사결정 지원",
    features: [
      "정책 효과분석",
      "통계조사",
      "성과평가",
      "정책 제언",
    ],
    image: `${import.meta.env.BASE_URL}images/business02_3.jpg`,
  },
];

export default function ResearchConsulting() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">RESEARCH & CONSULTING</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              리서치 & 빅데이터 분석
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              전문 리서치 역량과 빅데이터 분석 기술로 전략적 인사이트를 제공합니다.
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
