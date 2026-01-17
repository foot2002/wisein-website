import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "프로젝트 상담은 어떻게 진행되나요?",
    answer: "문의 양식을 통해 프로젝트 개요를 보내주시면, 담당 컨설턴트가 1-2 영업일 내 연락드립니다. 초기 상담은 무료로 진행되며, 고객의 요구사항을 파악한 후 맞춤형 제안서를 제공합니다."
  },
  {
    question: "공공기관 입찰 참여가 가능한가요?",
    answer: "네, 가능합니다. 저희는 조달청 등록업체이며, 다수의 공공기관 프로젝트 수행 경험이 있습니다. 나라장터, 지방자치단체 입찰 등 다양한 공공 조달에 참여하고 있습니다."
  },
  {
    question: "데이터 보안은 어떻게 관리하나요?",
    answer: "CSAP 클라우드 보안인증을 획득하였으며, 고객 데이터의 안전한 처리를 위해 엄격한 보안 정책을 적용합니다. 필요시 보안서약서 체결 및 망분리 환경에서의 작업도 가능합니다."
  },
  {
    question: "프로젝트 최소 규모가 있나요?",
    answer: "규모에 관계없이 모든 프로젝트에 대해 상담해 드립니다. 소규모 데이터 분석부터 대규모 시스템 구축까지 고객의 needs에 맞는 솔루션을 제안합니다."
  },
  {
    question: "교육 프로그램에 대해 알고 싶습니다.",
    answer: "K-Digital Training 등 국비지원 교육 프로그램을 운영하고 있습니다. 데이터 분석, AI/ML 과정 등 다양한 과정이 있으며, 취업 연계 프로그램도 함께 진행됩니다. 자세한 내용은 Education 페이지를 참고해주세요."
  },
  {
    question: "와이즈온(WiseON) 플랫폼은 어떤 기능을 제공하나요?",
    answer: "와이즈온은 공공기관을 위한 조사분석 AI 플랫폼으로, 설문조사 설계부터 데이터 수집, 분석, 리포트 생성까지 전 과정을 자동화합니다. 1,400개 이상의 공공기관에서 사용 중이며, CSAP 인증과 혁신조달 제품으로 선정되었습니다."
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">FAQ</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              자주 묻는 질문
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              고객님들이 자주 문의하시는 내용을 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl shadow-card overflow-hidden border border-border/50 hover:border-accent/50 transition-colors"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-foreground pr-4 text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                        openFaq === index && "rotate-180"
                      )}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
