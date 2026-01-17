export interface ChatbotOption {
  id: string;
  label: string;
  response: {
    message: string;
    cta?: {
      label: string;
      href: string;
    };
  };
}

export interface ChatbotScenario {
  id: string;
  title: string;
  options: ChatbotOption[];
}

export const chatbotScenarios: ChatbotScenario[] = [
  {
    id: "main",
    title: "무엇을 도와드릴까요?",
    options: [
      {
        id: "service",
        label: "서비스 문의",
        response: {
          message: "와이즈인컴퍼니는 데이터 분석, 리서치, AI 솔루션, 교육 프로그램 등 다양한 서비스를 제공합니다. 어떤 서비스에 관심이 있으신가요?",
          cta: {
            label: "서비스 보기",
            href: "/services",
          },
        },
      },
      {
        id: "pricing",
        label: "가격 및 소개",
        response: {
          message: "서비스 가격은 프로젝트 규모와 요구사항에 따라 달라집니다. 정확한 견적을 위해 상담이 필요합니다. 무료 상담을 통해 맞춤형 제안서를 받아보세요.",
          cta: {
            label: "상담 문의하기",
            href: "/support/contact",
          },
        },
      },
      {
        id: "public",
        label: "공공기관 이용",
        response: {
          message: "와이즈온(WiseON)은 1,400개 이상의 공공기관에서 사용 중인 조사분석 AI 플랫폼입니다. CSAP 인증과 혁신조달 제품으로 선정되어 공공기관에 안전하고 신뢰할 수 있는 서비스를 제공합니다.",
          cta: {
            label: "상세 정보 보기",
            href: "/services/business-solutions",
          },
        },
      },
      {
        id: "education",
        label: "교육 프로그램",
        response: {
          message: "국비지원 교육 프로그램을 운영하고 있습니다. 데이터 분석, AI/ML 과정 등 다양한 과정이 있으며, 취업 연계 프로그램도 함께 진행됩니다.",
          cta: {
            label: "교육 프로그램 보기",
            href: "/services/education",
          },
        },
      },
      {
        id: "contact",
        label: "연락처 정보",
        response: {
          message: "서울시 강남구 역삼로309 기성빌딩3층에 위치하고 있습니다.\n전화: 02-558-5144\n팩스: 02-558-5146\n이메일: wic@wiseinc.co.kr",
          cta: {
            label: "오시는 길 보기",
            href: "/about/location",
          },
        },
      },
    ],
  },
];

export function getScenarioById(id: string): ChatbotScenario | undefined {
  return chatbotScenarios.find((scenario) => scenario.id === id);
}

export function getOptionById(scenarioId: string, optionId: string): ChatbotOption | undefined {
  const scenario = getScenarioById(scenarioId);
  return scenario?.options.find((option) => option.id === optionId);
}
