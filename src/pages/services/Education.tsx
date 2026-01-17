import { Layout } from "@/components/layout/Layout";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "National Training Program",
    description: "고용노동부 K-Digital Training 등 국비지원 데이터 교육 과정 운영",
    features: [
      "데이터 분석 과정",
      "AI/ML 과정",
      "취업 연계",
      "실무 프로젝트",
    ],
    image: `${import.meta.env.BASE_URL}images/business03_1.jpg`,
  },
];

export default function Education() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">EDUCATION</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              국비교육 프로그램
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              정부 지원 교육 프로그램으로 데이터 분야 전문 인재를 양성합니다.
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
