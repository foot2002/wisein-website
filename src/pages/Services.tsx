import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  BarChart3, 
  GraduationCap, 
  LineChart,
  ArrowRight,
  Target,
  Lightbulb,
  Zap,
  PieChart
} from "lucide-react";

const serviceCategories = [
  {
    id: "business-solutions",
    icon: Brain,
    title: "Business Solutions",
    subtitle: "AI SaaS & 마케팅 자동화",
    description: "데이터 기반 의사결정을 위한 AI 솔루션과 마케팅 자동화 도구를 제공합니다.",
    services: [
      {
        title: "Survey & Analysis AI SaaS",
        description: "설문조사 설계부터 분석까지 AI가 자동으로 처리하는 올인원 리서치 플랫폼",
        features: ["AI 기반 설문 설계", "실시간 응답 분석", "인사이트 자동 생성", "대시보드 리포팅"],
      },
      {
        title: "Marketing Automation Solution",
        description: "고객 데이터 분석을 통한 마케팅 자동화 및 개인화 캠페인 솔루션",
        features: ["고객 세그먼테이션", "개인화 마케팅", "캠페인 자동화", "ROI 분석"],
      },
    ],
    color: "accent",
    href: "/services/business-solutions",
  },
  {
    id: "research-consulting",
    icon: BarChart3,
    title: "Research & Consulting",
    subtitle: "리서치 & 빅데이터 분석",
    description: "전문 리서치 역량과 빅데이터 분석 기술로 전략적 인사이트를 제공합니다.",
    services: [
      {
        title: "Research",
        description: "정량/정성 조사 설계부터 현장 조사, 분석까지 토탈 리서치 서비스",
        features: ["설문조사", "FGI/IDI", "패널 운영", "리서치 컨설팅"],
      },
      {
        title: "Big Data Analysis",
        description: "대용량 데이터 수집, 정제, 분석을 통한 비즈니스 인사이트 도출",
        features: ["데이터 수집/정제", "통계 분석", "머신러닝", "시각화"],
      },
      {
        title: "Policy & Statistical Analysis",
        description: "공공정책 효과성 분석 및 통계 기반 의사결정 지원",
        features: ["정책 효과분석", "통계조사", "성과평가", "정책 제언"],
      },
    ],
    color: "primary",
    href: "/services/research-consulting",
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Education",
    subtitle: "국비교육 프로그램",
    description: "정부 지원 교육 프로그램으로 데이터 분야 전문 인재를 양성합니다.",
    services: [
      {
        title: "National Training Program",
        description: "고용노동부 K-Digital Training 등 국비지원 데이터 교육 과정 운영",
        features: ["데이터 분석 과정", "AI/ML 과정", "취업 연계", "실무 프로젝트"],
      },
    ],
    color: "success",
    href: "/services/education",
  },
  {
    id: "platform",
    icon: LineChart,
    title: "Platform",
    subtitle: "B2C 금융 플랫폼",
    description: "일반 사용자를 위한 금융 데이터 분석 및 자산관리 플랫폼을 운영합니다.",
    services: [
      {
        title: "RichWay Financial Platform",
        description: "개인 금융 데이터 분석 기반의 스마트 자산관리 서비스",
        features: ["자산 현황 분석", "지출 패턴 분석", "투자 포트폴리오", "맞춤 금융 추천"],
      },
    ],
    color: "accent",
    href: "/services/platform",
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">OUR SERVICES</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              비즈니스 성장을 위한<br />
              데이터 & AI 솔루션
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              공공기관과 기업을 위한 맞춤형 데이터 솔루션부터 교육, 
              B2C 플랫폼까지 다양한 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24">
        <div className="container">
          <div className="space-y-32">
            {serviceCategories.map((category, index) => (
              <div key={category.id}>
                {/* 섹션 구분선 */}
                {index > 0 && (
                  <div className="mb-16 pt-16 border-t-2 border-border/60"></div>
                )}
                
                <div
                  className={`grid lg:grid-cols-2 gap-12 items-start ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Info */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                        <category.icon className="h-7 w-7 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-heading font-bold text-foreground">
                          {category.title}
                        </h2>
                        <p className="text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {category.description}
                    </p>
                    <Button asChild>
                      <Link to={category.href}>
                        자세히 보기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Service Cards */}
                  <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    {category.services.map((service, serviceIndex) => (
                      <Link
                        key={service.title}
                        to={category.href}
                        className="group block"
                      >
                        <div
                          className="relative bg-gradient-to-br from-purple-50 via-purple-50/50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50 overflow-hidden"
                          style={{
                            animationDelay: `${serviceIndex * 100}ms`,
                          }}
                        >
                          {/* 그라데이션 오버레이 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* 왼쪽 보라색 액센트 바 */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-l-2xl"></div>
                          
                          <div className="relative">
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-purple-600 transition-colors duration-300">
                              {service.title}
                            </h3>
                            <p className="text-base text-foreground/70 mb-5 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-purple-700 text-sm font-medium rounded-full border border-purple-200/50 shadow-sm group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                            
                            {/* 호버 시 화살표 */}
                            <div className="mt-4 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-sm font-medium">자세히 보기</span>
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-3">OUR PROCESS</p>
            <h2 className="text-display-sm font-bold text-foreground">
              프로젝트 진행 프로세스
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "요구사항 분석", desc: "비즈니스 목표와 현황을 파악합니다" },
              { icon: Lightbulb, title: "전략 수립", desc: "최적의 솔루션을 설계합니다" },
              { icon: Zap, title: "실행 & 개발", desc: "전문팀이 프로젝트를 수행합니다" },
              { icon: PieChart, title: "성과 분석", desc: "결과를 측정하고 개선합니다" },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
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
