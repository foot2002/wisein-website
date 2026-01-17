import { useEffect, useRef } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // 모든 섹션에 애니메이션 클래스 추가
    const sections = document.querySelectorAll("section:not(.hero-section)");
    sections.forEach((section) => {
      section.classList.add("scroll-fade-up");
      observer.observe(section);
    });

    // 카드와 그리드 아이템에도 적용
    const cards = document.querySelectorAll(".card-animate, [class*='grid'] > *");
    cards.forEach((card, index) => {
      card.classList.add("scroll-fade-up");
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}
