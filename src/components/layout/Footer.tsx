import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Printer } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Business Solutions", href: "/services/business-solutions" },
    { label: "Research & Consulting", href: "/services/research-consulting" },
    { label: "Education", href: "/services/education" },
    { label: "Platform", href: "/services/platform" },
  ],
  company: [
    { label: "Company Overview", href: "/about/overview" },
    { label: "Vision & Mission", href: "/about/vision" },
    { label: "History", href: "/about/history" },
    { label: "Press & Media", href: "/about/press" },
  ],
  support: [
    { label: "Contact Us", href: "/support/contact" },
    { label: "FAQ", href: "/support/faq" },
    { label: "Announcements", href: "/support/announcements" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={`${import.meta.env.BASE_URL}images/wisein_logo.png`}
                alt="Company Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              데이터와 AI로 여는 비즈니스의 세계.<br />
              <span className="whitespace-nowrap">공공기관 및 기업을 위한 신뢰할 수 있는 데이터 & AI 파트너입니다.</span>
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>서울시 강남구 역삼로309 기성빌딩3층</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:02-558-5144" className="hover:text-foreground transition-colors">02-558-5144</a>
              </div>
              <div className="flex items-center gap-3">
                <Printer className="h-4 w-4 text-accent" />
                <span>02-558-5146</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:wic@wiseinc.co.kr" className="hover:text-foreground transition-colors">wic@wiseinc.co.kr</a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © WiseIN Company. Since 2007. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
