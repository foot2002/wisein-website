import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">TERMS OF SERVICE</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              이용약관
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              와이즈인컴퍼니 서비스 이용약관입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제1조 (목적)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  이 약관은 와이즈인컴퍼니(이하 "회사")가 제공하는 데이터 분석, 리서치, AI 솔루션, 교육 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제2조 (정의)</h2>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>"서비스"란 회사가 제공하는 데이터 분석, 리서치, AI 솔루션, 교육 프로그램 등 모든 서비스를 의미합니다.</li>
                  <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 개인 또는 법인을 의미합니다.</li>
                  <li>"와이즈온(WiseON)"이란 회사가 제공하는 조사분석 AI 플랫폼을 의미합니다.</li>
                  <li>"콘텐츠"란 서비스를 통해 제공되는 모든 정보, 데이터, 분석 결과, 리포트 등을 의미합니다.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제3조 (약관의 게시와 개정)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제4조 (서비스의 제공 및 변경)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  회사는 다음과 같은 서비스를 제공합니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>데이터 분석 및 리서치 서비스</li>
                  <li>AI 솔루션 제공 (와이즈온 등)</li>
                  <li>국비지원 교육 프로그램</li>
                  <li>금융 플랫폼 서비스 (리치웨이)</li>
                  <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                </ul>
                <p className="text-foreground/80 leading-relaxed mt-4">
                  회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제5조 (서비스의 중단)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다. 회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검 시간은 서비스 제공화면에 공지한 바에 따릅니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제6조 (이용자의 의무)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  이용자는 다음 행위를 하여서는 안 됩니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
                  <li>고객의 데이터를 무단으로 복제, 배포, 판매하는 행위</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제7조 (저작권의 귀속 및 이용제한)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다. 이용자는 회사를 이용함으로써 얻은 정보 중 회사에 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  이용자가 서비스를 이용하면서 생성한 분석 결과, 리포트 등은 해당 이용자에게 귀속되며, 회사는 서비스 제공을 위해 필요한 범위 내에서만 이를 이용할 수 있습니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제8조 (데이터 보안 및 비밀유지)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  회사는 CSAP 클라우드 보안인증을 획득하여 고객 데이터의 안전한 처리를 보장합니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>회사는 이용자가 제공한 데이터를 엄격히 보안 관리하며, 제3자에게 제공하지 않습니다.</li>
                  <li>이용자는 프로젝트 수행 중 알게 된 회사의 기밀정보를 무단으로 유출하여서는 안 됩니다.</li>
                  <li>필요시 별도의 보안서약서를 체결할 수 있습니다.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제9조 (계약 해지 및 이용 제한)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  이용자는 언제든지 서비스 이용계약 해지 신청을 할 수 있으며, 회사는 관련법령이 정하는 바에 따라 이를 즉시 처리합니다.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 회사는 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제10조 (손해배상)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가 회사의 중대한 과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지 아니합니다. 유료 서비스의 경우, 회사는 관련 법령에 따라 손해배상책임을 부담합니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제11조 (면책조항)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  회사는 다음 각 호의 경우에는 책임을 지지 않습니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우</li>
                  <li>이용자의 귀책사유로 인한 서비스 이용의 장애</li>
                  <li>이용자가 제공한 데이터의 오류, 누락 등으로 인한 결과의 부정확성</li>
                  <li>제3자의 불법적인 행위로 인한 서비스의 중단</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제12조 (준거법 및 관할법원)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  이 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국 법을 적용하며, 본 분쟁으로 인하여 소송이 제기될 경우 서울중앙지방법원을 관할 법원으로 합니다.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 mt-8">
                <p className="text-foreground/80">
                  <strong className="text-foreground">부칙</strong>
                  <br />
                  이 약관은 2024년 1월 1일부터 시행됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
