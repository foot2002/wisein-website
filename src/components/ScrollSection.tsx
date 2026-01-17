import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export function ScrollSection({ 
  children, 
  className,
  delay = 0,
  direction = "up"
}: ScrollSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay]);

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        !isVisible && {
          "up": "opacity-0 translate-y-8",
          "down": "opacity-0 -translate-y-8",
          "left": "opacity-0 -translate-x-8",
          "right": "opacity-0 translate-x-8",
          "fade": "opacity-0",
        }[direction],
        isVisible && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
    >
      {children}
    </section>
  );
}
