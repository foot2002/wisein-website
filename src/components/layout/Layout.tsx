import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // 페이지 변경 및 새로고침 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [location.pathname]);

  // 컴포넌트 마운트 시(새로고침 포함) 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  // 스크롤 애니메이션 설정
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -80px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // 모든 섹션에 애니메이션 적용
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      // Hero 섹션은 제외
      if (!section.classList.contains("hero-section") && !section.classList.contains("scroll-fade-up")) {
        section.classList.add("scroll-fade-up");
        observer.observe(section);
      }
    });

    // 그리드와 카드 아이템에도 애니메이션 적용
    const gridItems = document.querySelectorAll(
      "section .grid > *, section [class*='grid'] > *, .bg-card, article"
    );
    gridItems.forEach((item, index) => {
      if (!item.closest("section")?.classList.contains("hero-section")) {
        item.classList.add("scroll-fade-up");
        (item as HTMLElement).style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
        observer.observe(item);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}
