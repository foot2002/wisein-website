import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Lightbulb, Rocket } from "lucide-react";

const missions = [
  {
    icon: Target,
    title: "조사분석 AI 솔루션",
    description: "와이즈온(WiseON)을 통해 공공기관의 조사분석 업무를 자동화하고 디지털 전환을 지원합니다.",
  },
  {
    icon: Lightbulb,
    title: "빅데이터 분석 서비스",
    description: "23년간 축적된 리서치 경험을 바탕으로 정확한 데이터 분석과 인사이트를 제공합니다.",
  },
  {
    icon: Rocket,
    title: "혁신 기술 개발",
    description: "기업부설연구소를 통해 AI 및 데이터 분석 기술을 지속적으로 연구·개발합니다.",
  },
  {
    icon: Eye,
    title: "전문 인재 양성",
    description: "국비지원 교육 프로그램을 통해 데이터 분야 전문 인재를 양성하고 산업 생태계에 기여합니다.",
  },
];

export default function VisionMission() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">VISION & MISSION</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              비전 & 미션
            </h1>
          </div>
        </div>
      </section>

      {/* Vision Image */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden mb-16">
              <img
                src="/images/vision_mission.jpg"
                alt="비전 & 미션"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-4xl font-bold text-muted-foreground/30">비전 & 미션</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>

            {/* Vision */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <Eye className="h-10 w-10 text-accent" />
                <h2 className="text-4xl font-bold text-foreground">Vision</h2>
              </div>
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 border-l-4 border-accent">
                <p className="text-3xl font-bold text-foreground leading-relaxed">
                  데이터와 AI로 세상을 이롭게 한다
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <Target className="h-10 w-10 text-accent" />
                <h2 className="text-4xl font-bold text-foreground">Mission</h2>
              </div>
              
              <p className="text-lg text-foreground/80 mb-12 leading-relaxed">
                우리의 비전을 달성하기 위해 다음과 같은 서비스와 기술을 제공합니다:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {missions.map((mission) => (
                  <div
                    key={mission.title}
                    className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <mission.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {mission.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* How we achieve vision */}
              <div className="bg-secondary/50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  비전 구현 방법
                </h3>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    와이즈인컴퍼니는 <strong className="text-foreground">1,400개 이상의 공공기관</strong>에 
                    조사분석 AI 솔루션을 제공하여 공공부문의 디지털 전환을 선도하고 있습니다. 
                    와이즈온(WiseON) 플랫폼을 통해 설문조사부터 분석까지의 전 과정을 자동화하여 
                    공공기관의 업무 효율성을 극대화하고 있습니다.
                  </p>
                  <p>
                    또한 <strong className="text-foreground">23년간 축적된 리서치 및 데이터 분석 경험</strong>을 
                    바탕으로 정확한 인사이트를 제공하고, 기업부설연구소를 통해 지속적인 기술 혁신을 추진하며, 
                    국비지원 교육 프로그램을 통해 데이터 분야 전문 인재를 양성하여 
                    산업 생태계 발전에 기여하고 있습니다.
                  </p>
                  <p>
                    CSAP 클라우드 보안인증과 혁신조달 제품 선정을 통해 공공기관의 신뢰를 확보하고, 
                    리치웨이(RichWay) 부자 플랫폼을 통해 개인 금융 관리 서비스까지 확장하여 
                    데이터와 AI 기술로 더 많은 사람들에게 가치를 제공하고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
