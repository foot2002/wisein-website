import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Brain, 
  Users, 
  Building2, 
  GraduationCap, 
  LineChart,
  ArrowRight,
  CheckCircle2,
  Award,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/hero-data-visualization.jpg";
import { CountUp } from "@/components/CountUp";
import { ScrollingClients } from "@/components/ScrollingClients";

// Stats data
const stats = [
  { label: "업력", value: 23, suffix: "년", prefix: "'" },
  { label: "프로젝트 수행", value: 2000, suffix: "+" },
  { label: "공공+기업", value: 1400, suffix: "" },
  { label: "회원수", value: 30000, suffix: "" },
];

// Services overview
const services = [
  {
    icon: Brain,
    title: "Business\nSolutions",
    description: "Survey & Analysis AI SaaS, 마케팅 자동화 솔루션으로 데이터 기반 의사결정을 지원합니다.",
    href: "/services/business-solutions",
  },
  {
    icon: BarChart3,
    title: "Research & Consulting",
    description: "빅데이터 분석, 정책 및 통계 분석으로 전략적 인사이트를 제공합니다.",
    href: "/services/research-consulting",
  },
  {
    icon: GraduationCap,
    title: "AI & Data\nEducation",
    description: "국비지원 교육 프로그램으로 데이터 전문 인재를 양성합니다.",
    href: "/services/education",
  },
  {
    icon: LineChart,
    title: "B2C Financial\nPlatform",
    description: "RichWay 금융 플랫폼으로 개인 금융 관리의 새로운 경험을 제공합니다.",
    href: "/services/platform",
  },
];

// Credentials
const credentials = [
  { icon: Award, label: "기업부설연구소 + 벤처기업 인증", year: "2012" },
  { icon: ShieldCheck, label: "CSAP 클라우드 보안인증", year: "2024" },
  { icon: TrendingUp, label: "혁신조달 제품", year: "2025" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Data visualization"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <p className="text-accent font-medium mb-4 animate-fade-up">
              DATA & AI COMPANY
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              데이터와 AI로 여는<br />
              비즈니스의 세계
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              공공기관과 기업을 위한 신뢰할 수 있는 데이터 & AI 파트너.<br />
              리서치부터 AI 솔루션까지, 데이터의 가치를 비즈니스 성과로 연결합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/support/contact">
                  상담 문의하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/services">서비스 둘러보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <CountUp 
                    end={stat.value} 
                    duration={5000}
                  />
                  {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 gradient-subtle">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-3">OUR SERVICES</p>
            <h2 className="text-display-sm font-bold text-foreground mb-4">
              비즈니스 성장을 위한 토탈 솔루션
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              데이터 수집부터 AI 적용까지, 비즈니스의 모든 단계에서 최적의 솔루션을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.href}
                className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* 아이콘과 제목을 같은 줄에 배치 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors whitespace-pre-line">
                    {service.title}
                  </h3>
                </div>
                
                {/* 구분선 */}
                <div className="border-t border-border/50 mb-6"></div>
                
                {/* 설명 */}
                <p className="text-lg text-foreground/80 leading-relaxed flex-1 text-left">
                  {service.description}
                </p>
                
                <div className="mt-4 flex items-center justify-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium mb-3">WHY WiseIN Company</p>
              <h2 className="text-display-sm font-bold text-foreground mb-6">
                신뢰할 수 있는 데이터 파트너
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                23년간 축적된 공공기관 및 대기업 프로젝트 경험을 바탕으로,
                정확한 분석과 실행 가능한 인사이트를 제공합니다.
              </p>
              
              <div className="space-y-4">
                {[
                  "대규모 프로젝트 2,000+ 경험",
                  "1,400+ 공공/기관 도입",
                  "혁신제품 + CSAP 인증",
                  "국내 유일 조사분석 AI 공공 SaaS",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-10">
                <Button asChild size="lg">
                  <Link to="/about">회사 소개</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/portfolio">포트폴리오</Link>
                </Button>
              </div>
            </div>

            {/* Credentials Cards */}
            <div className="grid gap-4">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center gap-6 bg-card rounded-xl p-6 shadow-card"
                >
                  <div className="w-24 h-24 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <cred.icon className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{cred.label}</p>
                    <p className="text-base text-muted-foreground mt-1">{cred.year}년 취득</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent font-medium mb-3">TRUSTED BY</p>
            <h2 className="text-heading font-bold text-primary-foreground">
              주요 고객사 및 파트너
            </h2>
          </div>
          
          <ScrollingClients />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 pattern-data">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm font-bold text-foreground mb-6">
              데이터의 가치를<br />
              비즈니스 성과로 연결하세요
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              프로젝트에 대해 상담하고 싶으시다면 언제든 연락주세요.
              전문 컨설턴트가 최적의 솔루션을 제안해 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl">
                <Link to="/support/contact">
                  무료 상담 신청
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/portfolio">프로젝트 사례 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
