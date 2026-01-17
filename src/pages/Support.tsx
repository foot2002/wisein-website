import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  ChevronDown,
  MessageCircle,
  FileText,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const contactInfo = [
  { icon: Phone, label: "전화", value: "02-1234-5678", href: "tel:02-1234-5678" },
  { icon: Mail, label: "이메일", value: "contact@datavision.co.kr", href: "mailto:contact@datavision.co.kr" },
  { icon: MapPin, label: "주소", value: "서울특별시 강남구 테헤란로 123, 15층", href: null },
];

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
    answer: "ISO 27001 정보보안 인증을 획득하였으며, 고객 데이터의 안전한 처리를 위해 엄격한 보안 정책을 적용합니다. 필요시 보안서약서 체결 및 망분리 환경에서의 작업도 가능합니다."
  },
  {
    question: "프로젝트 최소 규모가 있나요?",
    answer: "규모에 관계없이 모든 프로젝트에 대해 상담해 드립니다. 소규모 데이터 분석부터 대규모 시스템 구축까지 고객의 needs에 맞는 솔루션을 제안합니다."
  },
  {
    question: "교육 프로그램에 대해 알고 싶습니다.",
    answer: "K-Digital Training 등 국비지원 교육 프로그램을 운영하고 있습니다. 데이터 분석, AI/ML 과정 등 다양한 과정이 있으며, 취업 연계 프로그램도 함께 진행됩니다. 자세한 내용은 Education 페이지를 참고해주세요."
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    type: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">SUPPORT</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              무엇을 도와드릴까요?
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              프로젝트 상담, 서비스 문의, 기술 지원 등 
              어떤 질문이든 편하게 연락주세요.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: MessageCircle, label: "문의하기", href: "#contact" },
              { icon: HelpCircle, label: "자주 묻는 질문", href: "#faq" },
              { icon: FileText, label: "공지사항", href: "/support/announcements" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-secondary transition-colors"
              >
                <item.icon className="h-5 w-5 text-accent" />
                <span className="font-medium text-foreground">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-heading font-bold text-foreground mb-8">
                문의하기
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="example@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      회사/기관명
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="회사명"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    문의 유형 *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">선택해주세요</option>
                    <option value="project">프로젝트 상담</option>
                    <option value="solution">솔루션 문의</option>
                    <option value="education">교육 문의</option>
                    <option value="partnership">제휴/파트너십</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    문의 내용 *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="프로젝트 개요, 일정, 예산 등 구체적인 내용을 작성해주시면 더 정확한 상담이 가능합니다."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  문의 보내기
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-heading font-bold text-foreground mb-8">
                연락처
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-medium text-foreground hover:text-accent transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-12 p-6 bg-secondary/50 rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">업무 시간</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>평일</span>
                    <span className="text-foreground">09:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>점심시간</span>
                    <span className="text-foreground">12:00 - 13:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>주말/공휴일</span>
                    <span className="text-foreground">휴무</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-medium mb-3">FAQ</p>
              <h2 className="text-display-sm font-bold text-foreground">
                자주 묻는 질문
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl shadow-card overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-medium text-foreground pr-4">
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
                      <p className="text-muted-foreground leading-relaxed">
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
