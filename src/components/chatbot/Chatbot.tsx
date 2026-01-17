import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatbotScenarios, type ChatbotOption } from "@/data/chatbotData";

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  type: "user" | "bot";
  content: string;
  cta?: {
    label: string;
    href: string;
  };
}

// Intent detection based on keywords
function detectIntent(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Research intents (more specific first)
  if (/\b(리서치|설문조사|설문|조사)\b/.test(lowerText)) {
    if (/\b(가격|비용|요금|견적|금액|돈|얼마|의뢰.*비용)\b/.test(lowerText)) {
      return "research_pricing";
    }
    if (/\b(공공|기관|정부|행정|공기업|공공기관)\b/.test(lowerText)) {
      return "research_public";
    }
    if (/\b(기간|진행.*기간|걸리|소요|일정)\b/.test(lowerText)) {
      return "research_process";
    }
    if (/\b(표본|표본수|표본.*수|응답.*수|응답자)\b/.test(lowerText)) {
      return "research_scope";
    }
    if (/\b(결과물|결과|형태|리포트|보고서|산출물)\b/.test(lowerText)) {
      return "research_output";
    }
    if (/\b(단독|의뢰|진행|가능)\b/.test(lowerText)) {
      return "research_general";
    }
    return "research_general";
  }
  
  // Solution intents (more specific first)
  if (/\b(솔루션|와이즈온|wiseon|조사분석.*솔루션|데이터인|datain)\b/.test(lowerText)) {
    if (/\b(기능|어떤.*기능|제공.*기능|기능.*있)\b/.test(lowerText)) {
      return "solution_features";
    }
    if (/\b(공공|기관|정부|행정|공기업|공공기관|써도|사용.*가능)\b/.test(lowerText)) {
      return "solution_public";
    }
    if (/\b(가격|비용|요금|견적|금액|책정|도입.*비용)\b/.test(lowerText)) {
      return "solution_pricing";
    }
    if (/\b(기존.*데이터|설문.*데이터|데이터.*분석|분석.*가능)\b/.test(lowerText)) {
      return "solution_data";
    }
    if (/\b(리포트|보고서|자동|자동.*생성|자동.*리포트)\b/.test(lowerText)) {
      return "solution_reporting";
    }
    if (/\b(도입|절차|절차.*궁금|도입.*과정|프로세스)\b/.test(lowerText)) {
      return "solution_process";
    }
    if (/\b(리서치.*같이|같이.*쓰|번들|패키지|세트)\b/.test(lowerText)) {
      return "solution_bundle";
    }
    return "solution_features";
  }
  
  // Education intents (more specific first)
  if (/\b(교육|학습|강의|과정|내일배움|국비|교육프로그램|수강|교육.*비용)\b/.test(lowerText)) {
    if (/\b(내일배움|내일배움카드|카드|내일배움.*카드)\b/.test(lowerText)) {
      return "education_card";
    }
    if (/\b(비용|가격|요금|금액|얼마|교육.*비용)\b/.test(lowerText)) {
      return "education_pricing";
    }
    if (/\b(비전공|전공|전공자|비전공자|초보|초급|난이도)\b/.test(lowerText)) {
      return "education_level";
    }
    if (/\b(온라인|오프라인|온라인.*오프라인|형태|방식|수업.*형태)\b/.test(lowerText)) {
      return "education_format";
    }
    if (/\b(기간|과정.*기간|진행.*기간|오래|몇.*개월|몇.*주)\b/.test(lowerText)) {
      return "education_duration";
    }
    if (/\b(수료증|이수|인정|자격증|증명서|인증)\b/.test(lowerText)) {
      return "education_cert";
    }
    return "education";
  }
  
  // General pricing keywords
  if (/\b(가격|비용|요금|견적|금액|돈|얼마|pricing|price|cost)\b/.test(lowerText)) {
    return "pricing";
  }
  
  // General public institution keywords
  if (/\b(공공|기관|정부|행정|공기업|공공기관|public|government)\b/.test(lowerText)) {
    return "public";
  }
  
  // General service keywords
  if (/\b(서비스|솔루션|제품|플랫폼|서비스문의|service|solution|product|platform)\b/.test(lowerText)) {
    return "service";
  }
  
  // Contact keywords
  if (/\b(연락|문의|전화|이메일|주소|오시는길|연락처|contact|phone|email|address)\b/.test(lowerText)) {
    return "contact";
  }
  
  return "default";
}

// Predefined responses based on intent
function getResponseByIntent(intent: string): { message: string; cta?: { label: string; href: string } } {
  const responses: Record<string, { message: string; cta?: { label: string; href: string } }> = {
    // Research intents
    research_pricing: {
      message: "리서치 및 설문조사 비용은 프로젝트 규모, 표본 수, 조사 방법, 분석 범위에 따라 달라집니다. 일반적으로 소규모 프로젝트는 500만원~2,000만원, 중규모는 2,000만원~5,000만원, 대규모는 5,000만원 이상의 범위입니다. 정확한 견적을 위해 무료 상담을 받아보시기 바랍니다.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    research_public: {
      message: "네, 공공기관 리서치도 진행하고 있습니다. 23년간 공공기관 프로젝트 2,000건 이상의 경험을 보유하고 있으며, 공공기관 특성에 맞는 조사 설계 및 분석 서비스를 제공합니다. 공공기관 프로젝트는 별도의 절차와 요구사항이 있을 수 있어 상담을 통해 구체적인 계획을 수립하는 것을 권장합니다.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    research_process: {
      message: "리서치 진행 기간은 프로젝트 규모와 복잡도에 따라 다릅니다. 일반적으로 소규모 설문조사는 2~4주, 중규모는 4~8주, 대규모는 8~12주 정도 소요됩니다. 조사 설계(1주), 데이터 수집(2~6주), 분석 및 리포트 작성(1~2주) 단계로 구성되며, 프로젝트별로 일정을 조정할 수 있습니다.",
      cta: {
        label: "서비스 보기",
        href: "/services/research-consulting",
      },
    },
    research_scope: {
      message: "표본 수는 조사 목적과 통계적 신뢰도 요구사항에 따라 결정됩니다. 일반적으로 소규모 조사는 300~500명, 중규모는 500~1,000명, 대규모는 1,000명 이상까지 가능합니다. 최대 10,000명 이상의 대규모 조사도 진행 가능하며, 온라인, 전화, 면접 등 다양한 방법을 통해 효율적으로 데이터를 수집합니다.",
      cta: {
        label: "서비스 보기",
        href: "/services/research-consulting",
      },
    },
    research_output: {
      message: "리서치 결과물은 프로젝트 요구사항에 따라 다양한 형태로 제공됩니다. 기본적으로 통계 분석 리포트(PDF), 데이터 파일(Excel, SPSS), 대시보드, 프레젠테이션 자료 등을 제공하며, 필요시 인포그래픽, 영상 리포트 등도 제작 가능합니다. 모든 결과물은 클라이언트의 요구사항에 맞춰 커스터마이징됩니다.",
      cta: {
        label: "서비스 보기",
        href: "/services/research-consulting",
      },
    },
    research_general: {
      message: "네, 리서치만 단독으로도 의뢰 가능합니다. 설문조사 설계부터 데이터 수집, 분석, 리포트 작성까지 전체 프로젝트를 진행하거나, 특정 단계만 선택적으로 의뢰하실 수도 있습니다. 23년간 축적된 노하우와 전문 인력으로 고품질의 리서치 서비스를 제공합니다.",
      cta: {
        label: "서비스 보기",
        href: "/services/research-consulting",
      },
    },
    
    // Solution intents
    solution_features: {
      message: "조사분석 솔루션 WiseON은 설문 설계부터 응답 수집, 데이터 분석, 리포트 생성까지 전 과정을 자동화하는 AI 기반 플랫폼입니다. 주요 기능으로는 AI 기반 설문 설계, 실시간 응답 수집, 자동 데이터 분석, 인사이트 자동 생성, 대시보드 리포팅 등이 있습니다. 공공기관과 기업 모두에서 활용 가능한 통합 솔루션입니다.",
      cta: {
        label: "상세 정보 보기",
        href: "/services/business-solutions",
      },
    },
    solution_public: {
      message: "네, WiseON은 공공기관에서 사용 가능합니다. 현재 1,400개 이상의 공공기관에서 사용 중이며, CSAP 클라우드 보안인증과 혁신조달 제품으로 선정되어 공공기관에 안전하고 신뢰할 수 있는 서비스를 제공합니다. 공공기관 특화 기능과 보안 요구사항을 모두 충족합니다.",
      cta: {
        label: "상세 정보 보기",
        href: "/services/business-solutions",
      },
    },
    solution_pricing: {
      message: "솔루션 가격은 사용자 수, 기능 패키지, 지원 범위에 따라 달라집니다. 기본 패키지는 월 50만원~200만원, 중급 패키지는 월 200만원~500만원, 고급 패키지는 월 500만원 이상의 범위입니다. 공공기관의 경우 별도 계약 조건이 적용될 수 있으며, 정확한 견적은 상담을 통해 제공됩니다.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    solution_data: {
      message: "네, 기존 설문 데이터도 분석 가능합니다. Excel, CSV, SPSS 등 다양한 형식의 데이터를 업로드하여 분석할 수 있으며, 기존 데이터와 새로운 조사 데이터를 통합 분석하는 것도 가능합니다. 데이터 형식 변환, 정제, 통계 분석 등 모든 과정을 지원합니다.",
      cta: {
        label: "상세 정보 보기",
        href: "/services/business-solutions",
      },
    },
    solution_reporting: {
      message: "네, 리포트는 자동으로 생성됩니다. WiseON은 AI 기반 인사이트 자동 생성 기능을 제공하여, 데이터 수집이 완료되면 자동으로 분석 리포트와 대시보드를 생성합니다. 기본 리포트 외에도 커스터마이징된 리포트, 프레젠테이션 자료, 인포그래픽 등 다양한 형태로 제공 가능합니다.",
      cta: {
        label: "상세 정보 보기",
        href: "/services/business-solutions",
      },
    },
    solution_process: {
      message: "솔루션 도입 절차는 다음과 같습니다: 1) 상담 및 요구사항 분석(1주), 2) 맞춤형 제안서 작성 및 계약(1~2주), 3) 시스템 설정 및 커스터마이징(2~4주), 4) 사용자 교육 및 테스트(1주), 5) 정식 오픈 및 운영 지원. 전체 과정은 약 4~8주 정도 소요되며, 프로젝트 규모에 따라 조정 가능합니다.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    solution_bundle: {
      message: "네, 리서치와 솔루션을 함께 사용하는 것도 가능합니다. 통합 패키지를 통해 설문조사 서비스와 WiseON 솔루션을 함께 제공하며, 할인 혜택도 적용됩니다. 리서치 프로젝트를 진행하면서 동시에 솔루션을 도입하여 향후 자체적으로 조사분석을 진행할 수 있도록 지원합니다.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    
    // Education intents
    education_card: {
      message: "네, 내일배움카드로 수강하실 수 있습니다. 와이즈인컴퍼니는 내일배움카드 훈련기관으로 승인되어 있어, 국비지원으로 교육을 받으실 수 있습니다. 내일배움카드 신청 및 사용 방법에 대해서는 상담을 통해 안내해드리며, 카드 발급부터 수강 신청까지 전 과정을 지원합니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    education_pricing: {
      message: "교육 비용은 과정과 수강 형태에 따라 다릅니다. 국비지원 과정의 경우 내일배움카드로 전액 지원 가능하며, 일반 과정은 50만원~200만원 정도입니다. 기업 단체 교육은 별도 협의가 가능하며, 취업 연계 프로그램의 경우 추가 혜택이 제공됩니다. 정확한 비용은 상담을 통해 안내해드립니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    education_level: {
      message: "네, 비전공자도 수강 가능합니다. 초급 과정부터 시작하여 단계적으로 학습할 수 있도록 커리큘럼이 구성되어 있으며, 기초 통계부터 데이터 분석, AI/ML까지 체계적으로 배울 수 있습니다. 실무 중심의 교육으로 이론과 실습을 균형있게 제공하여 비전공자도 충분히 따라올 수 있습니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    education_format: {
      message: "교육은 온라인과 오프라인 모두 제공됩니다. 온라인 교육은 실시간 화상 강의와 녹화 강의를 병행하며, 오프라인 교육은 서울 강남 본사에서 진행됩니다. 과정에 따라 온라인 전용, 오프라인 전용, 또는 하이브리드 형태로 운영되며, 수강생의 편의에 맞춰 선택할 수 있습니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    education_duration: {
      message: "교육 과정 기간은 과정에 따라 다릅니다. 단기 과정은 4주~8주, 중기 과정은 8주~16주, 장기 과정은 16주~24주 정도입니다. 데이터 분석 기초 과정은 8주, AI/ML 심화 과정은 16주, 통계분석 전문가 과정은 24주로 구성되어 있으며, 주 2~3회 수업으로 진행됩니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    education_cert: {
      message: "네, 수료증과 이수 인정이 가능합니다. 과정을 완료하시면 와이즈인컴퍼니 수료증을 발급해드리며, 일부 과정은 관련 자격증 취득을 위한 준비 과정으로도 인정됩니다. 수료증은 이력서에 기재 가능하며, 취업 연계 프로그램을 통해 취업 지원 시에도 활용할 수 있습니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    
    // General intents
    pricing: {
      message: "서비스 가격은 프로젝트 규모와 요구사항에 따라 달라집니다. 정확한 견적을 위해 상담이 필요합니다. 무료 상담을 통해 맞춤형 제안서를 받아보세요.",
      cta: {
        label: "상담 문의하기",
        href: "/support/contact",
      },
    },
    public: {
      message: "와이즈온(WiseON)은 1,400개 이상의 공공기관에서 사용 중인 조사분석 AI 플랫폼입니다. CSAP 인증과 혁신조달 제품으로 선정되어 공공기관에 안전하고 신뢰할 수 있는 서비스를 제공합니다.",
      cta: {
        label: "상세 정보 보기",
        href: "/services/business-solutions",
      },
    },
    education: {
      message: "국비지원 교육 프로그램을 운영하고 있습니다. 데이터 분석, AI/ML 과정 등 다양한 과정이 있으며, 취업 연계 프로그램도 함께 진행됩니다.",
      cta: {
        label: "교육 프로그램 보기",
        href: "/services/education",
      },
    },
    service: {
      message: "와이즈인컴퍼니는 데이터 분석, 리서치, AI 솔루션, 교육 프로그램 등 다양한 서비스를 제공합니다. 어떤 서비스에 관심이 있으신가요?",
      cta: {
        label: "서비스 보기",
        href: "/services",
      },
    },
    contact: {
      message: "서울시 강남구 역삼로309 기성빌딩3층에 위치하고 있습니다.\n전화: 02-558-5144\n팩스: 02-558-5146\n이메일: wic@wiseinc.co.kr",
      cta: {
        label: "오시는 길 보기",
        href: "/about/location",
      },
    },
    default: {
      message: "죄송합니다. 더 구체적으로 질문해 주시면 도움을 드릴 수 있습니다. 아래 빠른 메뉴를 통해 원하시는 정보를 찾아보세요.",
    },
  };
  
  return responses[intent] || responses.default;
}

export function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "안녕하세요! 와이즈인컴퍼니 상담 챗봇입니다. 무엇을 도와드릴까요?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scenario = chatbotScenarios.find((s) => s.id === "main");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Detect intent and get response
    const intent = detectIntent(text);
    const response = getResponseByIntent(intent);
    
    // Add bot response after a short delay (simulate thinking)
    setTimeout(() => {
      const botMessage: Message = {
        type: "bot",
        content: response.message,
        cta: response.cta,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);

    setInputText("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleOptionClick = (option: ChatbotOption) => {
    // Add user message (the option label)
    const userMessage: Message = {
      type: "user",
      content: option.label,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Use the option's predefined response directly
    setTimeout(() => {
      const botMessage: Message = {
        type: "bot",
        content: option.response.message,
        cta: option.response.cta,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-card rounded-3xl shadow-2xl border border-border/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-5 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-lg tracking-tight">상담 챗봇</h3>
          <p className="text-xs text-primary-foreground/70 font-light tracking-wide">와이즈인컴퍼니</p>
        </div>
        <button
          onClick={onClose}
          className="text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1.5 rounded-full hover:bg-primary-foreground/10"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        {/* Messages */}
        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            <div
              className={`flex items-start gap-4 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "bot" && (
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-4 max-w-[85%] ${
                  message.type === "user"
                    ? "bg-primary text-white"
                    : "bg-secondary/40"
                }`}
              >
                <p className={`text-sm leading-relaxed whitespace-pre-line tracking-wide font-light ${
                  message.type === "user" ? "text-white" : "text-foreground/90"
                }`}>
                  {message.content}
                </p>
              </div>
              {message.type === "user" && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-medium">나</span>
                </div>
              )}
            </div>
            
            {/* CTA Button for bot messages */}
            {message.type === "bot" && message.cta && (
              <div className="pl-14">
                <Button asChild className="w-full rounded-xl shadow-md hover:shadow-lg" size="lg">
                  <Link to={message.cta.href} onClick={onClose}>
                    <span className="tracking-wide">{message.cta.label}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Quick Options (shown only when welcome message is the only message) */}
        {messages.length === 1 && (
          <div className="space-y-3 pt-2">
            {scenario?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left bg-card border border-border/60 rounded-xl px-5 py-4 hover:bg-secondary/50 hover:border-accent/40 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-foreground/90 group-hover:text-accent transition-colors tracking-wide">
                    {option.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-accent transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-secondary/30 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm text-foreground placeholder:text-muted-foreground/50 tracking-wide"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            aria-label="전송"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
