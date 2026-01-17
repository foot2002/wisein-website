import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Eye, 
  Heart,
  ArrowRight,
  Award,
  ShieldCheck,
  TrendingUp,
  Building2,
  Users,
  Lightbulb
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "정확성",
    description: "데이터에 기반한 정확한 분석과 객관적 인사이트를 제공합니다.",
  },
  {
    icon: Heart,
    title: "신뢰",
    description: "10년간 축적된 경험과 전문성으로 고객의 신뢰를 얻어왔습니다.",
  },
  {
    icon: Lightbulb,
    title: "혁신",
    description: "최신 기술과 방법론을 적극 도입하여 새로운 가치를 창출합니다.",
  },
];

const timeline = [
  { year: "2015", title: "회사 설립", description: "데이터 분석 전문 기업으로 출발" },
  { year: "2016", title: "벤처기업 인증", description: "기술혁신형 벤처기업 인증 획득" },
  { year: "2018", title: "기업부설연구소 설립", description: "AI/빅데이터 R&D 연구소 인정" },
  { year: "2019", title: "교육사업 진출", description: "국비지원 데이터 교육 사업 시작" },
  { year: "2020", title: "ISO 27001 인증", description: "정보보안 국제 표준 인증 획득" },
  { year: "2021", title: "AI 솔루션 출시", description: "자체 AI SaaS 플랫폼 런칭" },
  { year: "2023", title: "RichWay 플랫폼 출시", description: "B2C 금융 플랫폼 서비스 시작" },
  { year: "2024", title: "글로벌 진출", description: "해외 시장 진출 준비 중" },
];

const credentials = [
  { icon: Award, label: "기업부설연구소", year: "2018" },
  { icon: ShieldCheck, label: "ISO 27001", year: "2020" },
  { icon: TrendingUp, label: "벤처기업 인증", year: "2016" },
  { icon: Building2, label: "이노비즈 인증", year: "2019" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">ABOUT US</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              데이터로 비즈니스의<br />
              미래를 설계합니다
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              2015년 설립 이래, DataVision은 공공기관과 기업을 위한 
              데이터 & AI 전문 파트너로 성장해왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="h-8 w-8 text-accent" />
                <h2 className="text-heading font-bold text-foreground">Vision</h2>
              </div>
              <p className="text-2xl font-medium text-foreground leading-relaxed mb-6">
                "데이터와 AI로 모든 조직의 <br />
                <span className="text-accent">의사결정을 혁신</span>한다"
              </p>
              <p className="text-muted-foreground leading-relaxed">
                우리는 모든 조직이 데이터 기반의 합리적 의사결정을 할 수 있는 
                세상을 만들어갑니다. 복잡한 데이터를 이해하기 쉬운 인사이트로 
                전환하여, 더 나은 비즈니스 결정을 지원합니다.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-accent" />
                <h2 className="text-heading font-bold text-foreground">Mission</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "고객의 비즈니스 목표 달성을 위한 데이터 기반 솔루션 제공",
                  "공공기관과 기업의 디지털 전환 지원",
                  "데이터 분야 전문 인재 양성을 통한 산업 생태계 발전 기여",
                  "신뢰할 수 있는 장기적 파트너십 구축",
                ].map((mission) => (
                  <li key={mission} className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-3">CORE VALUES</p>
            <h2 className="text-display-sm font-bold text-foreground">
              우리의 핵심 가치
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center bg-card rounded-xl p-8 shadow-card"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-3">HISTORY</p>
            <h2 className="text-display-sm font-bold text-foreground">
              성장의 발자취
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
              
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <span className="text-accent font-bold text-lg">{item.year}</span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-accent md:-translate-x-1.5" />
                  
                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent font-medium mb-3">CREDENTIALS</p>
            <h2 className="text-heading font-bold text-primary-foreground">
              인증 및 자격
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {credentials.map((cred) => (
              <div
                key={cred.label}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <cred.icon className="h-10 w-10 text-accent mx-auto mb-4" />
                <p className="font-semibold text-primary-foreground mb-1">
                  {cred.label}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {cred.year}년 취득
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium mb-3">OUR TEAM</p>
              <h2 className="text-display-sm font-bold text-foreground mb-6">
                전문성을 갖춘<br />
                데이터 전문가 그룹
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                석·박사급 연구원, 데이터 사이언티스트, 리서치 전문가 등 
                80명 이상의 전문 인력이 고객의 프로젝트를 성공으로 이끕니다.
              </p>
              <Button asChild>
                <Link to="/support/contact">
                  함께하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "80+", label: "전문 인력" },
                { icon: Award, value: "30%", label: "석·박사 비율" },
                { icon: TrendingUp, value: "10+", label: "평균 경력(년)" },
                { icon: Building2, value: "5", label: "사업부문" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl p-6 shadow-card text-center"
                >
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub Pages CTA */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Press & Media", href: "/about/press", desc: "보도자료 및 미디어" },
              { title: "History", href: "/about/history", desc: "연혁 상세보기" },
              { title: "Location", href: "/about/location", desc: "오시는 길" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex items-center justify-between p-6 bg-card rounded-xl shadow-card hover:shadow-elegant transition-all"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
