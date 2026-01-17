import { Layout } from "@/components/layout/Layout";

export default function CompanyOverview() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">COMPANY OVERVIEW</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              회사 개요
            </h1>
          </div>
        </div>
      </section>

      {/* Company Image */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden mb-16">
              <img
                src={`${import.meta.env.BASE_URL}images/company.jpg`}
                alt="회사 개요"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-4xl font-bold text-muted-foreground/30">회사 개요</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>

            {/* Company Description */}
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <p className="text-xl font-medium text-foreground mb-6">
                  와이즈인컴퍼니는 2003년 설립 이래, 데이터와 AI 기술을 통해 
                  공공기관과 기업의 의사결정을 지원하는 전문 기업입니다.
                </p>
                
                <p>
                  23년간 축적된 리서치 및 데이터 분석 경험을 바탕으로, 
                  국내 최초 통계분석 온라인 사업을 시작하여 현재는 
                  1,400개 이상의 공공기관에 조사분석 AI 솔루션을 제공하고 있습니다.
                </p>

                <p>
                  우리는 설문조사부터 빅데이터 분석, AI 솔루션 개발까지 
                  데이터의 전 과정을 아우르는 전문 역량을 보유하고 있으며, 
                  특히 공공기관을 위한 조사분석 자동화 플랫폼 '와이즈온(WiseON)'을 
                  통해 디지털 전환을 선도하고 있습니다.
                </p>

                <p>
                  기업부설연구소와 벤처기업 인증을 보유한 혁신 기업으로, 
                  CSAP 클라우드 보안인증과 혁신조달 제품 선정을 통해 
                  공공기관의 신뢰를 받고 있습니다.
                </p>

                <p>
                  또한 국비지원 교육 프로그램을 통해 데이터 분야 전문 인재를 양성하고, 
                  리치웨이(RichWay) 부자 플랫폼을 통해 개인 금융 관리 서비스도 제공하며, 
                  데이터와 AI로 세상을 이롭게 하는 비전을 실현해가고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
