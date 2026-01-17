import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">PRIVACY POLICY</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              개인정보처리방침
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              와이즈인컴퍼니는 고객의 개인정보를 보호하기 위해 최선을 다하고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제1조 (개인정보의 처리목적)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>서비스 제공 및 계약 이행: 데이터 분석, 리서치, AI 솔루션 제공, 교육 서비스 제공</li>
                  <li>고객 문의 및 상담 응대: 문의사항 접수 및 처리, 고객 지원</li>
                  <li>마케팅 및 프로모션: 신규 서비스 안내, 이벤트 정보 제공 (동의 시)</li>
                  <li>법령상 의무 이행: 세법, 통계법 등 관련 법령에 따른 의무 이행</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                  <li>웹사이트 방문기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제3조 (처리하는 개인정보의 항목)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 다음의 개인정보 항목을 처리하고 있습니다.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">필수항목</h3>
                    <p className="text-foreground/80">이름, 이메일, 전화번호, 회사명, 직책</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">선택항목</h3>
                    <p className="text-foreground/80">팩스번호, 주소, 관심 서비스 분야</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">자동 수집 항목</h3>
                    <p className="text-foreground/80">IP주소, 쿠키, 접속 로그, 방문 일시, 서비스 이용 기록</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제4조 (개인정보의 제3자 제공)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  와이즈인컴퍼니는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 단, 공공기관 프로젝트 수행 시 계약상 의무에 따라 필요한 경우에만 최소한의 정보를 제공할 수 있습니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제5조 (개인정보처리의 위탁)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <div className="bg-secondary/50 rounded-lg p-6">
                  <ul className="space-y-3 text-foreground/80">
                    <li>
                      <strong className="text-foreground">클라우드 서비스 제공업체</strong>
                      <br />
                      위탁업무: 서버 운영 및 데이터 보관
                      <br />
                      보유기간: 계약 종료 시까지
                    </li>
                    <li>
                      <strong className="text-foreground">이메일 발송 서비스</strong>
                      <br />
                      위탁업무: 이메일 발송 및 관리
                      <br />
                      보유기간: 계약 종료 시까지
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  정보주체는 와이즈인컴퍼니에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>개인정보 처리정지 요구권</li>
                  <li>개인정보 열람요구권</li>
                  <li>개인정보 정정·삭제요구권</li>
                  <li>개인정보 처리정지 요구권</li>
                </ul>
                <p className="text-foreground/80 leading-relaxed mt-4">
                  권리 행사는 개인정보보호법 시행령 제41조 제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 와이즈인컴퍼니는 이에 대해 지체 없이 조치하겠습니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제7조 (개인정보의 파기)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
                </p>
                <div className="space-y-3 text-foreground/80">
                  <p><strong className="text-foreground">파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</p>
                  <p><strong className="text-foreground">파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제8조 (개인정보 보호책임자)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-secondary/50 rounded-lg p-6">
                  <p className="text-foreground/80 mb-2">
                    <strong className="text-foreground">개인정보 보호책임자</strong>
                  </p>
                  <p className="text-foreground/80 mb-1">이름: [담당자명]</p>
                  <p className="text-foreground/80 mb-1">직책: 개인정보보호팀장</p>
                  <p className="text-foreground/80 mb-1">연락처: 02-558-5144</p>
                  <p className="text-foreground/80">이메일: wic@wiseinc.co.kr</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제9조 (개인정보의 안전성 확보조치)</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  와이즈인컴퍼니는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">제10조 (개인정보 처리방침 변경)</h2>
                <p className="text-foreground/80 leading-relaxed">
                  이 개인정보처리방침은 2024년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
