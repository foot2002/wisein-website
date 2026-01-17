import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Chatbot } from "./Chatbot";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center border border-primary-foreground/10"
        aria-label="상담 챗봇 열기"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  );
}
