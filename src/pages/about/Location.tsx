import { Layout } from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Printer } from "lucide-react";

export default function Location() {
  const address = "서울시 강남구 역삼로309 기성빌딩3층";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">LOCATION</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              오시는 길
            </h1>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Map */}
              <div>
                <div className="aspect-square bg-secondary/50 rounded-xl overflow-hidden mb-6 border border-border">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="와이즈인컴퍼니 위치"
                  ></iframe>
                </div>
                <div className="flex gap-4">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-card rounded-lg border border-border hover:bg-secondary transition-colors text-center text-sm font-medium text-foreground"
                  >
                    Google 지도에서 보기
                  </a>
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-card rounded-lg border border-border hover:bg-secondary transition-colors text-center text-sm font-medium text-foreground"
                  >
                    네이버 지도에서 보기
                  </a>
                </div>
              </div>

              {/* Address Info */}
              <div>
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="text-2xl font-bold text-foreground mb-8">연락처 정보</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">주소</p>
                        <p className="text-lg font-medium text-foreground">{address}</p>
                        <p className="text-sm text-muted-foreground mt-2">와이즈인컴퍼니</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">전화</p>
                        <a
                          href="tel:02-558-5144"
                          className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                        >
                          02-558-5144
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Printer className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">팩스</p>
                        <p className="text-lg font-medium text-foreground">
                          02-558-5146
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">이메일</p>
                        <a
                          href="mailto:wic@wiseinc.co.kr"
                          className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                        >
                          wic@wiseinc.co.kr
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4">교통편</h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li>• 지하철: 2호선 역삼역 3번 출구 도보 5분</li>
                      <li>• 버스: 간선 146, 740, 지선 3412, 6411</li>
                      <li>• 주차: 기성빌딩 지하 주차장 이용 가능</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
