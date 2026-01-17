import { Layout } from "@/components/layout/Layout";

const timeline = [
  { 
    year: "2026", 
    items: [
      "와이즈온(WiseON) 1,400개 공공기관 도입",
      "국내최초 통계분석 국비과정 승인 / 바이브코딩 교육 런칭",
      "소상공인을 위한 마케팅자동화 솔루션 출시"
    ]
  },
  { 
    year: "2025", 
    items: [
      "와이즈온(WiseON) 혁신제품 선정",
      "내일배움교육 훈련기관 승인",
      "리치웨이(rich-way) 부자 플랫폼 사업 런칭"
    ]
  },
  { 
    year: "2024", 
    items: [
      "와이즈온(WiseON) CSAP인증, 디지털몰, 조달제품 등록"
    ]
  },
  { 
    year: "2023", 
    items: [
      "공공 SaaS, 와이즈온(WiseON) 선정 (120개 기업 중 4위)"
    ]
  },
  { 
    year: "2019", 
    items: [
      "데이터인(DataIN) 정식 출시"
    ]
  },
  { 
    year: "2017", 
    items: [
      "데이터인(DataIN) 조사분석 자동화 솔루션 베타버전 출시"
    ]
  },
  { 
    year: "2016", 
    items: [
      "기업부설연구소, 벤처기업 인증"
    ]
  },
  { 
    year: "2015", 
    items: [
      "설문조사 및 분석 자동화 솔루션 개발 착수"
    ]
  },
  { 
    year: "2014", 
    items: [
      "연간 리서치&데이터분석 200회 돌파"
    ]
  },
  { 
    year: "2012", 
    items: [
      "국비지원 통계분석 전문 교육기관 인허가"
    ]
  },
  { 
    year: "2009", 
    items: [
      "와이즈인컴퍼니 회사명 변경"
    ]
  },
  { 
    year: "2007", 
    items: [
      "와이즈리서치 법인 설립"
    ]
  },
  { 
    year: "2005", 
    items: [
      "국내 최초 통계분석 온라인 사업 시작"
    ]
  },
  { 
    year: "2003", 
    items: [
      "사회와통계연구소 개인회사 설립"
    ]
  },
];

export default function History() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">HISTORY</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              회사 연혁
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              2003년 설립 이래 23년간의 성장 발자취를 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
              
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <span className="text-accent font-bold text-2xl mb-4 block">{item.year}</span>
                    <div className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      {item.items.map((historyItem, idx) => (
                        <p key={idx} className="text-foreground leading-relaxed">
                          {historyItem}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background md:-translate-x-2" />
                  
                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
