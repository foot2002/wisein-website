import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Printer
} from "lucide-react";
import { saveInquiry, initializeStorage } from "@/lib/adminStorage";

const contactInfo = [
  { icon: Phone, label: "전화", value: "02-558-5144", href: "tel:02-558-5144" },
  { icon: Mail, label: "이메일", value: "wic@wiseinc.co.kr", href: "mailto:wic@wiseinc.co.kr" },
  { icon: Printer, label: "팩스", value: "02-558-5146", href: null },
  { icon: MapPin, label: "주소", value: "서울시 강남구 역삼로309 기성빌딩3층", href: null },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    type: "",
    message: "",
  });

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        type: formData.type,
        message: formData.message,
      });
      alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        type: "",
        message: "",
      });
    } catch (error) {
      alert("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-hero">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">CONTACT US</p>
            <h1 className="text-4xl md:text-display font-bold text-primary-foreground mb-6">
              문의하기
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              프로젝트 상담, 서비스 문의, 기술 지원 등 
              어떤 질문이든 편하게 연락주세요.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24">
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
    </Layout>
  );
}
