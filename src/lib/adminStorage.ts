// Admin data storage using Supabase (with localStorage fallback)
import { supabase, isSupabaseEnabled } from './supabase';

export interface PortfolioItem {
  id: number;
  category: string;
  client: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  type: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  status: "pending" | "replied";
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PressRelease {
  id: number;
  title: string;
  date: string;
  source: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  PORTFOLIO: "admin_portfolio",
  BLOG: "admin_blog",
  INQUIRIES: "admin_inquiries",
  ANNOUNCEMENTS: "admin_announcements",
  PRESS: "admin_press",
  AUTH: "admin_auth",
  NEWSLETTER: "admin_newsletter",
};

// Initialize with default data if empty
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO)) {
    const defaultPortfolio: PortfolioItem[] = [
      {
        id: 1,
        category: "public",
        client: "과학기술정보통신부",
        title: "AI 기술 동향 빅데이터 분석 시스템 구축",
        description: "국내외 AI 기술 동향을 실시간으로 수집하고 분석하는 빅데이터 플랫폼을 구축하여 정책 수립 의사결정을 지원했습니다. 머신러닝 기반 자연어 처리 기술을 활용하여 논문, 특허, 뉴스 등 다양한 소스를 통합 분석하고 시각화 대시보드를 제공했습니다.",
        year: "2024",
        tags: ["빅데이터", "AI", "정책분석"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2024-01-15").toISOString(),
        updatedAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: 2,
        category: "public",
        client: "한국데이터산업진흥원",
        title: "데이터 산업 실태조사 및 분석",
        description: "국내 데이터 산업의 현황과 트렌드를 파악하기 위한 대규모 실태조사를 수행하고 정책 제언을 도출했습니다. 500개 이상의 기업을 대상으로 설문조사와 심층 인터뷰를 진행하여 산업 생태계를 분석했습니다.",
        year: "2024",
        tags: ["리서치", "통계분석", "정책연구"],
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        createdAt: new Date("2024-02-10").toISOString(),
        updatedAt: new Date("2024-02-10").toISOString(),
      },
      {
        id: 3,
        category: "enterprise",
        client: "삼성전자",
        title: "고객 만족도 분석 및 개선 컨설팅",
        description: "글로벌 고객 데이터 분석을 통해 제품별 만족도 요인을 도출하고 개선 전략을 수립했습니다. 전 세계 50개국 고객 피드백을 AI로 분석하여 제품 개발 우선순위를 결정하는 시스템을 구축했습니다.",
        year: "2024",
        tags: ["고객분석", "컨설팅", "데이터분석"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2024-03-05").toISOString(),
        updatedAt: new Date("2024-03-05").toISOString(),
      },
      {
        id: 4,
        category: "public",
        client: "국민건강보험공단",
        title: "의료 빅데이터 분석 플랫폼 고도화",
        description: "건강보험 청구 데이터를 활용한 질병 예측 모델 개발 및 분석 시스템을 고도화했습니다. 딥러닝 기반 예측 모델로 만성질환 발병 위험도를 사전에 예측하여 예방 의료 서비스를 제공합니다.",
        year: "2023",
        tags: ["헬스케어", "머신러닝", "플랫폼"],
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c3507c62332?w=800&h=600&fit=crop",
        createdAt: new Date("2023-11-20").toISOString(),
        updatedAt: new Date("2023-11-20").toISOString(),
      },
      {
        id: 5,
        category: "research",
        client: "한국과학기술연구원",
        title: "연구성과 분석 시스템 구축",
        description: "연구 논문 및 특허 데이터를 분석하여 기술 트렌드와 연구 성과를 시각화하는 시스템을 구축했습니다. 네트워크 분석 기법을 활용하여 연구자 간 협업 패턴과 기술 융합 트렌드를 분석합니다.",
        year: "2023",
        tags: ["연구분석", "시각화", "데이터플랫폼"],
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
        createdAt: new Date("2023-10-15").toISOString(),
        updatedAt: new Date("2023-10-15").toISOString(),
      },
      {
        id: 6,
        category: "manufacturing",
        client: "현대자동차",
        title: "스마트팩토리 품질 예측 시스템",
        description: "제조 공정 데이터를 분석하여 불량률을 예측하고 품질을 개선하는 AI 시스템을 도입했습니다. 실시간 센서 데이터와 과거 생산 이력을 결합하여 불량 발생을 사전에 예측하고 공정을 최적화합니다.",
        year: "2023",
        tags: ["스마트팩토리", "AI", "품질관리"],
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
        createdAt: new Date("2023-09-10").toISOString(),
        updatedAt: new Date("2023-09-10").toISOString(),
      },
      {
        id: 7,
        category: "enterprise",
        client: "신한은행",
        title: "고객 이탈 예측 모델 개발",
        description: "고객 거래 패턴을 분석하여 이탈 가능성을 예측하고 선제적 마케팅 전략을 수립했습니다. 머신러닝 모델로 고객 생애주기별 이탈 신호를 감지하여 맞춤형 상품을 추천하는 시스템을 구축했습니다.",
        year: "2023",
        tags: ["금융", "머신러닝", "마케팅"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2023-08-25").toISOString(),
        updatedAt: new Date("2023-08-25").toISOString(),
      },
      {
        id: 8,
        category: "public",
        client: "서울특별시",
        title: "시민 정책 만족도 조사 및 분석",
        description: "서울시 주요 정책에 대한 시민 만족도를 조사하고 개선 방향을 제시했습니다. 10만 명 이상의 시민을 대상으로 온라인/오프라인 설문조사를 진행하고 텍스트 마이닝 기법으로 개선 의견을 분석했습니다.",
        year: "2023",
        tags: ["정책조사", "여론분석", "리서치"],
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        createdAt: new Date("2023-07-20").toISOString(),
        updatedAt: new Date("2023-07-20").toISOString(),
      },
      {
        id: 9,
        category: "enterprise",
        client: "LG전자",
        title: "제품 리뷰 감성 분석 및 인사이트 도출",
        description: "전자상거래 플랫폼의 제품 리뷰를 AI로 분석하여 고객 만족도와 개선점을 도출했습니다. 자연어 처리 기술로 리뷰의 감성을 분석하고 제품별 강점과 약점을 자동으로 분류하여 제품 개발팀에 인사이트를 제공합니다.",
        year: "2023",
        tags: ["감성분석", "NLP", "제품개발"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2023-06-15").toISOString(),
        updatedAt: new Date("2023-06-15").toISOString(),
      },
      {
        id: 10,
        category: "public",
        client: "교육부",
        title: "교육 정책 효과성 평가 시스템",
        description: "교육 정책의 효과성을 데이터로 측정하고 평가하는 시스템을 구축했습니다. 학생 성취도, 출석률, 진로 선택 등 다양한 교육 지표를 통합 분석하여 정책의 성과를 정량적으로 평가합니다.",
        year: "2023",
        tags: ["교육분석", "정책평가", "데이터분석"],
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        createdAt: new Date("2023-05-10").toISOString(),
        updatedAt: new Date("2023-05-10").toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(defaultPortfolio));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BLOG)) {
    const defaultBlog: BlogPost[] = [
      {
        id: 1,
        category: "인사이트",
        title: "2024 데이터 산업 트렌드: AI와 데이터 분석의 융합",
        excerpt: "2024년 데이터 산업의 핵심 트렌드를 분석하고, 기업들이 AI와 데이터 분석을 어떻게 활용하고 있는지 살펴봅니다. 특히 생성형 AI의 부상이 데이터 분석 방식에 미치는 영향을 중점적으로 다룹니다.",
        content: "2024년 데이터 산업은 AI와의 융합이 핵심 트렌드로 부상했습니다. 생성형 AI의 등장으로 데이터 분석의 패러다임이 변화하고 있으며, 기업들은 AI 기반 자동화 솔루션을 적극 도입하고 있습니다.\n\n특히 주목할 점은 데이터 분석의 민주화입니다. 이전에는 데이터 과학자만이 할 수 있던 복잡한 분석 작업을 이제는 비전문가도 AI 도구를 통해 수행할 수 있게 되었습니다.\n\n향후 데이터 산업은 실시간 분석, 자동화, 그리고 AI 기반 인사이트 생성에 집중할 것으로 예상됩니다.",
        author: "김데이터",
        date: "2024.01.15",
        readTime: "8분",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2024-01-15").toISOString(),
        updatedAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: 2,
        category: "기술",
        title: "머신러닝 모델의 편향성 문제와 해결 방안",
        excerpt: "AI 모델의 공정성과 편향성 문제를 다루고, 실무에서 적용할 수 있는 해결 방안을 제시합니다.",
        content: "머신러닝 모델의 편향성은 중요한 윤리적 이슈입니다. 학습 데이터에 내재된 편향이 모델의 예측 결과에 반영되면 불공정한 결정이 내려질 수 있습니다.\n\n편향성을 해결하기 위한 주요 방법:\n1. 데이터 다양성 확보: 다양한 그룹을 대표하는 균형잡힌 데이터셋 구축\n2. 공정성 지표 모니터링: 모델 성능을 다양한 그룹별로 측정\n3. 알고리즘 수정: 공정성을 고려한 손실 함수 설계\n4. 정기적인 재학습: 시간에 따라 변화하는 패턴을 반영",
        author: "이분석",
        date: "2024.01.10",
        readTime: "6분",
        imageUrl: "https://images.unsplash.com/photo-1555255705-c5083e130163?w=800&h=600&fit=crop",
        createdAt: new Date("2024-01-10").toISOString(),
        updatedAt: new Date("2024-01-10").toISOString(),
      },
      {
        id: 3,
        category: "케이스스터디",
        title: "공공기관 빅데이터 플랫폼 구축 사례",
        excerpt: "정부 기관을 위한 빅데이터 플랫폼을 구축한 경험을 공유하고, 성공 요인을 분석합니다.",
        content: "공공기관 빅데이터 플랫폼 구축은 민간과 다른 특수성을 고려해야 합니다. 보안, 개인정보 보호, 투명성이 핵심 요구사항입니다.\n\n성공 요인:\n- 단계적 도입: 작은 프로젝트부터 시작하여 점진적으로 확장\n- 이해관계자 참여: 각 부서의 요구사항을 충분히 반영\n- 데이터 거버넌스: 명확한 데이터 소유권과 사용 규칙 수립\n- 지속적인 교육: 담당자들의 데이터 리터러시 향상",
        author: "박컨설턴트",
        date: "2024.01.05",
        readTime: "10분",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        createdAt: new Date("2024-01-05").toISOString(),
        updatedAt: new Date("2024-01-05").toISOString(),
      },
      {
        id: 4,
        category: "인사이트",
        title: "데이터 거버넌스: 왜 중요하고 어떻게 구축할까?",
        excerpt: "데이터 거버넌스의 핵심 개념과 조직에 맞는 거버넌스 체계 구축 방법을 설명합니다.",
        content: "데이터 거버넌스는 데이터의 품질, 보안, 사용을 관리하는 체계입니다. 효과적인 거버넌스는 데이터 기반 의사결정의 신뢰성을 보장합니다.\n\n구축 단계:\n1. 데이터 인벤토리: 조직 내 모든 데이터 자산 파악\n2. 정책 수립: 데이터 수집, 저장, 사용 규칙 정의\n3. 역할 정의: 데이터 소유자, 관리자, 사용자 역할 명확화\n4. 도구 도입: 데이터 카탈로그, 품질 모니터링 도구 활용\n5. 지속적 개선: 정기적인 검토와 개선 프로세스 운영",
        author: "최전략",
        date: "2023.12.28",
        readTime: "7분",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2023-12-28").toISOString(),
        updatedAt: new Date("2023-12-28").toISOString(),
      },
      {
        id: 5,
        category: "기술",
        title: "실시간 데이터 처리를 위한 스트리밍 아키텍처",
        excerpt: "Apache Kafka와 Spark Streaming을 활용한 실시간 데이터 처리 아키텍처를 소개합니다.",
        content: "실시간 데이터 처리는 빠른 의사결정을 위해 필수적입니다. 스트리밍 아키텍처는 데이터가 생성되는 즉시 처리하여 인사이트를 제공합니다.\n\n주요 구성 요소:\n- Kafka: 고성능 메시지 브로커로 데이터 스트림 관리\n- Spark Streaming: 대용량 스트림 데이터 처리 엔진\n- Redis: 실시간 결과 캐싱\n- Elasticsearch: 실시간 검색 및 분석\n\n구현 시 고려사항:\n- 처리 지연시간 최소화\n- 장애 복구 메커니즘\n- 확장 가능한 아키텍처 설계",
        author: "정엔지니어",
        date: "2023.12.20",
        readTime: "12분",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        createdAt: new Date("2023-12-20").toISOString(),
        updatedAt: new Date("2023-12-20").toISOString(),
      },
      {
        id: 6,
        category: "리서치",
        title: "설문조사 설계의 핵심 원칙",
        excerpt: "효과적인 설문조사를 위한 문항 설계 원칙과 주의사항을 다룹니다.",
        content: "좋은 설문조사는 명확한 목적과 체계적인 설계에서 시작됩니다. 응답자의 입장에서 생각하고 편리하게 답변할 수 있도록 설계해야 합니다.\n\n핵심 원칙:\n1. 목적 명확화: 조사 목적에 맞는 문항만 포함\n2. 문항 순서: 쉬운 문항부터 어려운 문항 순으로 배치\n3. 응답 옵션: 명확하고 포괄적인 선택지 제공\n4. 길이 조절: 응답 부담을 최소화하는 적절한 길이\n5. 사전 테스트: 실제 조사 전에 소규모 테스트 진행",
        author: "강리서처",
        date: "2023.12.15",
        readTime: "5분",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
        createdAt: new Date("2023-12-15").toISOString(),
        updatedAt: new Date("2023-12-15").toISOString(),
      },
      {
        id: 7,
        category: "케이스스터디",
        title: "금융권 고객 세그멘테이션 프로젝트 성공 사례",
        excerpt: "대형 은행의 고객 데이터를 분석하여 맞춤형 마케팅 전략을 수립한 사례를 공유합니다.",
        content: "고객 세그멘테이션은 효과적인 마케팅의 핵심입니다. 거래 패턴, 자산 규모, 라이프스타일 등을 종합 분석하여 고객을 그룹화했습니다.\n\n주요 성과:\n- 고객 이탈률 30% 감소\n- 맞춤형 상품 추천으로 수신 증가\n- 고객 만족도 향상\n\n핵심 인사이트:\n- 연령대별로 선호하는 금융 상품이 다름\n- 거래 빈도가 높은 고객일수록 충성도 높음\n- 디지털 채널 선호도가 빠르게 증가",
        author: "박컨설턴트",
        date: "2023.12.10",
        readTime: "9분",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        createdAt: new Date("2023-12-10").toISOString(),
        updatedAt: new Date("2023-12-10").toISOString(),
      },
      {
        id: 8,
        category: "기술",
        title: "데이터 레이크 vs 데이터 웨어하우스: 선택 가이드",
        excerpt: "데이터 레이크와 데이터 웨어하우스의 차이점과 각각의 적합한 사용 사례를 설명합니다.",
        content: "데이터 레이크와 데이터 웨어하우스는 각각 다른 목적에 최적화되어 있습니다.\n\n데이터 웨어하우스:\n- 구조화된 데이터 저장에 적합\n- 사전 정의된 스키마 필요\n- 빠른 쿼리 성능\n- 비즈니스 인텔리전스에 최적화\n\n데이터 레이크:\n- 구조화/비구조화 데이터 모두 저장 가능\n- 스키마 온 리드 방식\n- 유연한 데이터 분석\n- 머신러닝과 빅데이터 분석에 적합\n\n선택 기준: 데이터 유형, 분석 목적, 예산을 종합적으로 고려해야 합니다.",
        author: "정엔지니어",
        date: "2023.12.05",
        readTime: "8분",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        createdAt: new Date("2023-12-05").toISOString(),
        updatedAt: new Date("2023-12-05").toISOString(),
      },
      {
        id: 9,
        category: "인사이트",
        title: "2024년 데이터 직무 트렌드와 필요한 역량",
        excerpt: "데이터 분야에서 요구되는 새로운 역량과 직무 트렌드를 분석합니다.",
        content: "2024년 데이터 직무는 AI와의 융합이 핵심입니다. 단순한 데이터 분석을 넘어 AI 모델 개발과 운영까지 담당하는 역할이 증가하고 있습니다.\n\n주요 트렌드:\n- MLOps 전문가 수요 증가\n- 데이터 엔지니어링 역량 강화\n- 도메인 전문성과 기술 역량의 결합\n- 자동화 도구 활용 능력\n\n필요한 역량:\n- 프로그래밍: Python, SQL, Spark\n- 클라우드: AWS, Azure, GCP\n- AI/ML: 모델 개발 및 배포\n- 커뮤니케이션: 비기술자와의 협업 능력",
        author: "김데이터",
        date: "2023.11.30",
        readTime: "6분",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
        createdAt: new Date("2023-11-30").toISOString(),
        updatedAt: new Date("2023-11-30").toISOString(),
      },
      {
        id: 10,
        category: "리서치",
        title: "온라인 설문조사의 응답률 향상 전략",
        excerpt: "온라인 설문조사에서 응답률을 높이는 실전 전략과 팁을 공유합니다.",
        content: "온라인 설문조사의 응답률은 설문 설계와 실행 전략에 따라 크게 달라집니다.\n\n응답률 향상 전략:\n1. 명확한 제목과 소개: 설문 목적과 소요 시간을 명확히 안내\n2. 모바일 최적화: 스마트폰에서도 편리하게 답변 가능하도록 설계\n3. 인센티브 제공: 소정의 사례금이나 경품 제공\n4. 리마인더: 미응답자에게 적절한 시점에 재안내\n5. 설문 길이: 5-10분 이내로 조절\n6. 문항 수: 20개 이하 권장\n\n추가 팁:\n- 진행률 표시기로 완료율 시각화\n- 필수 문항 최소화\n- 감사 인사와 결과 공유 약속",
        author: "강리서처",
        date: "2023.11.25",
        readTime: "7분",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
        createdAt: new Date("2023-11-25").toISOString(),
        updatedAt: new Date("2023-11-25").toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(defaultBlog));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
  }
}

// Portfolio functions
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database format to app format
      return (data || []).map((item: any) => ({
        id: item.id,
        category: item.category,
        client: item.client,
        title: item.title,
        description: item.description,
        year: item.year,
        tags: item.tags || [],
        imageUrl: item.image_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching portfolio from Supabase:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
  return data ? JSON.parse(data) : [];
}

export async function getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return undefined;
      
      return {
        id: data.id,
        category: data.category,
        client: data.client,
        title: data.title,
        description: data.description,
        year: data.year,
        tags: data.tags || [],
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching portfolio item from Supabase:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  const items = await getPortfolioItems();
  return items.find((item) => item.id === id);
}

export async function savePortfolioItem(item: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">): Promise<PortfolioItem> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .insert({
          category: item.category,
          client: item.client,
          title: item.title,
          description: item.description,
          year: item.year,
          tags: item.tags,
          image_url: item.imageUrl,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newItem: PortfolioItem = {
        id: data.id,
        category: data.category,
        client: data.client,
        title: data.title,
        description: data.description,
        year: data.year,
        tags: data.tags || [],
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      // Also save to localStorage as backup
      const localItems = await getPortfolioItems();
      localItems.push(newItem);
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(localItems));
      
      return newItem;
    } catch (error) {
      console.error('Error saving portfolio to Supabase:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  const items = await getPortfolioItems();
  const newItem: PortfolioItem = {
    ...item,
    id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(items));
  return newItem;
}

export async function updatePortfolioItem(id: number, updates: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const updateData: any = {};
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.client !== undefined) updateData.client = updates.client;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.year !== undefined) updateData.year = updates.year;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      
      const { data, error } = await supabase
        .from('portfolio')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const updatedItem: PortfolioItem = {
        id: data.id,
        category: data.category,
        client: data.client,
        title: data.title,
        description: data.description,
        year: data.year,
        tags: data.tags || [],
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      // Also update localStorage
      const localItems = await getPortfolioItems();
      const localIndex = localItems.findIndex((item) => item.id === id);
      if (localIndex !== -1) {
        localItems[localIndex] = updatedItem;
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(localItems));
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating portfolio in Supabase:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  const items = await getPortfolioItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  
  items[index] = {
    ...items[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(items));
  return items[index];
}

export async function deletePortfolioItem(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Also delete from localStorage
      const localItems = await getPortfolioItems();
      const filtered = localItems.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting portfolio from Supabase:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  const items = await getPortfolioItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(filtered));
  return filtered.length < items.length;
}

// Blog functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        category: item.category,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        date: item.date,
        readTime: item.read_time,
        imageUrl: item.image_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching blog from Supabase:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.BLOG);
  return data ? JSON.parse(data) : [];
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return undefined;
      
      return {
        id: data.id,
        category: data.category,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        date: data.date,
        readTime: data.read_time,
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching blog post from Supabase:', error);
    }
  }
  
  const posts = await getBlogPosts();
  return posts.find((post) => post.id === id);
}

export async function saveBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog')
        .insert({
          category: post.category,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          date: post.date,
          read_time: post.readTime,
          image_url: post.imageUrl,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newPost: BlogPost = {
        id: data.id,
        category: data.category,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        date: data.date,
        readTime: data.read_time,
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localPosts = await getBlogPosts();
      localPosts.push(newPost);
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(localPosts));
      
      return newPost;
    } catch (error) {
      console.error('Error saving blog to Supabase:', error);
    }
  }
  
  const posts = await getBlogPosts();
  const newPost: BlogPost = {
    ...post,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
  return newPost;
}

export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const updateData: any = {};
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.readTime !== undefined) updateData.read_time = updates.readTime;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      
      const { data, error } = await supabase
        .from('blog')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const updatedPost: BlogPost = {
        id: data.id,
        category: data.category,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        date: data.date,
        readTime: data.read_time,
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localPosts = await getBlogPosts();
      const localIndex = localPosts.findIndex((post) => post.id === id);
      if (localIndex !== -1) {
        localPosts[localIndex] = updatedPost;
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(localPosts));
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating blog in Supabase:', error);
    }
  }
  
  const posts = await getBlogPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
  return posts[index];
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('blog')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const localPosts = await getBlogPosts();
      const filtered = localPosts.filter((post) => post.id !== id);
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting blog from Supabase:', error);
    }
  }
  
  const posts = await getBlogPosts();
  const filtered = posts.filter((post) => post.id !== id);
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(filtered));
  return filtered.length < posts.length;
}

// Inquiry functions
export async function getInquiries(): Promise<Inquiry[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        company: item.company,
        phone: item.phone,
        type: item.type,
        message: item.message,
        reply: item.reply,
        repliedAt: item.replied_at,
        createdAt: item.created_at,
        status: item.status,
      }));
    } catch (error) {
      console.error('Error fetching inquiries from Supabase:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
  return data ? JSON.parse(data) : [];
}

export async function saveInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert({
          name: inquiry.name,
          email: inquiry.email,
          company: inquiry.company,
          phone: inquiry.phone,
          type: inquiry.type,
          message: inquiry.message,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newInquiry: Inquiry = {
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        type: data.type,
        message: data.message,
        reply: data.reply,
        repliedAt: data.replied_at,
        createdAt: data.created_at,
        status: data.status,
      };
      
      const localInquiries = await getInquiries();
      localInquiries.push(newInquiry);
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(localInquiries));
      
      return newInquiry;
    } catch (error) {
      console.error('Error saving inquiry to Supabase:', error);
    }
  }
  
  const inquiries = await getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: inquiries.length > 0 ? Math.max(...inquiries.map((i) => i.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  inquiries.push(newInquiry);
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  return newInquiry;
}

export async function updateInquiry(id: number, updates: Partial<Inquiry>): Promise<Inquiry | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.company !== undefined) updateData.company = updates.company;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.reply !== undefined) {
        updateData.reply = updates.reply;
        updateData.replied_at = new Date().toISOString();
        updateData.status = 'replied';
      }
      
      const { data, error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const updatedInquiry: Inquiry = {
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        type: data.type,
        message: data.message,
        reply: data.reply,
        repliedAt: data.replied_at,
        createdAt: data.created_at,
        status: data.status,
      };
      
      const localInquiries = await getInquiries();
      const localIndex = localInquiries.findIndex((inquiry) => inquiry.id === id);
      if (localIndex !== -1) {
        localInquiries[localIndex] = updatedInquiry;
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(localInquiries));
      }
      
      return updatedInquiry;
    } catch (error) {
      console.error('Error updating inquiry in Supabase:', error);
    }
  }
  
  const inquiries = await getInquiries();
  const index = inquiries.findIndex((inquiry) => inquiry.id === id);
  if (index === -1) return null;
  
  inquiries[index] = {
    ...inquiries[index],
    ...updates,
    id,
    repliedAt: updates.reply ? new Date().toISOString() : inquiries[index].repliedAt,
    status: updates.reply ? "replied" : inquiries[index].status,
  };
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  return inquiries[index];
}

export async function deleteInquiry(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const localInquiries = await getInquiries();
      const filtered = localInquiries.filter((inquiry) => inquiry.id !== id);
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting inquiry from Supabase:', error);
    }
  }
  
  const inquiries = await getInquiries();
  const filtered = inquiries.filter((inquiry) => inquiry.id !== id);
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
  return filtered.length < inquiries.length;
}

// Auth functions
export function setAuthToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.AUTH, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH);
}

export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

export function isAuthenticated(): boolean {
  return getAuthToken() === "admin_authenticated";
}

// Announcement functions
export async function getAnnouncements(): Promise<Announcement[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        category: item.category,
        content: item.content,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching announcements from Supabase:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
  return data ? JSON.parse(data) : [];
}

export async function saveAnnouncement(announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt">): Promise<Announcement> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcement.title,
          date: announcement.date,
          category: announcement.category,
          content: announcement.content,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newAnnouncement: Announcement = {
        id: data.id,
        title: data.title,
        date: data.date,
        category: data.category,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localAnnouncements = await getAnnouncements();
      localAnnouncements.push(newAnnouncement);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(localAnnouncements));
      
      return newAnnouncement;
    } catch (error) {
      console.error('Error saving announcement to Supabase:', error);
    }
  }
  
  const announcements = await getAnnouncements();
  const newAnnouncement: Announcement = {
    ...announcement,
    id: announcements.length > 0 ? Math.max(...announcements.map((a) => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  announcements.push(newAnnouncement);
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  return newAnnouncement;
}

export async function updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.content !== undefined) updateData.content = updates.content;
      
      const { data, error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const updatedAnnouncement: Announcement = {
        id: data.id,
        title: data.title,
        date: data.date,
        category: data.category,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localAnnouncements = await getAnnouncements();
      const localIndex = localAnnouncements.findIndex((a) => a.id === id);
      if (localIndex !== -1) {
        localAnnouncements[localIndex] = updatedAnnouncement;
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(localAnnouncements));
      }
      
      return updatedAnnouncement;
    } catch (error) {
      console.error('Error updating announcement in Supabase:', error);
    }
  }
  
  const announcements = await getAnnouncements();
  const index = announcements.findIndex((a) => a.id === id);
  if (index === -1) return null;
  
  announcements[index] = {
    ...announcements[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  return announcements[index];
}

export async function deleteAnnouncement(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const localAnnouncements = await getAnnouncements();
      const filtered = localAnnouncements.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting announcement from Supabase:', error);
    }
  }
  
  const announcements = await getAnnouncements();
  const filtered = announcements.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
  return filtered.length < announcements.length;
}

// Press Release functions
export async function getPressReleases(): Promise<PressRelease[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        source: item.source,
        url: item.url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching press releases from Supabase:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.PRESS);
  return data ? JSON.parse(data) : [];
}

export async function savePressRelease(press: Omit<PressRelease, "id" | "createdAt" | "updatedAt">): Promise<PressRelease> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .insert({
          title: press.title,
          date: press.date,
          source: press.source,
          url: press.url,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newPress: PressRelease = {
        id: data.id,
        title: data.title,
        date: data.date,
        source: data.source,
        url: data.url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localPressReleases = await getPressReleases();
      localPressReleases.push(newPress);
      localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(localPressReleases));
      
      return newPress;
    } catch (error) {
      console.error('Error saving press release to Supabase:', error);
    }
  }
  
  const pressReleases = await getPressReleases();
  const newPress: PressRelease = {
    ...press,
    id: pressReleases.length > 0 ? Math.max(...pressReleases.map((p) => p.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  pressReleases.push(newPress);
  localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(pressReleases));
  return newPress;
}

export async function updatePressRelease(id: number, updates: Partial<PressRelease>): Promise<PressRelease | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.url !== undefined) updateData.url = updates.url;
      
      const { data, error } = await supabase
        .from('press_releases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const updatedPress: PressRelease = {
        id: data.id,
        title: data.title,
        date: data.date,
        source: data.source,
        url: data.url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      const localPressReleases = await getPressReleases();
      const localIndex = localPressReleases.findIndex((p) => p.id === id);
      if (localIndex !== -1) {
        localPressReleases[localIndex] = updatedPress;
        localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(localPressReleases));
      }
      
      return updatedPress;
    } catch (error) {
      console.error('Error updating press release in Supabase:', error);
    }
  }
  
  const pressReleases = await getPressReleases();
  const index = pressReleases.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  pressReleases[index] = {
    ...pressReleases[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(pressReleases));
  return pressReleases[index];
}

export async function deletePressRelease(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('press_releases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const localPressReleases = await getPressReleases();
      const filtered = localPressReleases.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting press release from Supabase:', error);
    }
  }
  
  const pressReleases = await getPressReleases();
  const filtered = pressReleases.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRESS, JSON.stringify(filtered));
  return filtered.length < pressReleases.length;
}

// Newsletter Subscriber functions
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        email: item.email,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error('Error fetching newsletter subscribers from Supabase:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
  return data ? JSON.parse(data) : [];
}

export async function saveNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | null> {
  if (isSupabaseEnabled() && supabase) {
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      if (existing) {
        return null; // Already subscribed
      }
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.trim(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newSubscriber: NewsletterSubscriber = {
        id: data.id,
        email: data.email,
        createdAt: data.created_at,
      };
      
      const localSubscribers = await getNewsletterSubscribers();
      localSubscribers.push(newSubscriber);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(localSubscribers));
      
      return newSubscriber;
    } catch (error) {
      console.error('Error saving newsletter subscriber to Supabase:', error);
    }
  }
  
  const subscribers = await getNewsletterSubscribers();
  
  // Check if email already exists
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return null; // Already subscribed
  }
  
  const newSubscriber: NewsletterSubscriber = {
    id: subscribers.length > 0 ? Math.max(...subscribers.map((s) => s.id)) + 1 : 1,
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };
  subscribers.push(newSubscriber);
  localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(subscribers));
  return newSubscriber;
}

export async function deleteNewsletterSubscriber(id: number): Promise<boolean> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const localSubscribers = await getNewsletterSubscribers();
      const filtered = localSubscribers.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting newsletter subscriber from Supabase:', error);
    }
  }
  
  const subscribers = await getNewsletterSubscribers();
  const filtered = subscribers.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(filtered));
  return filtered.length < subscribers.length;
}

// Reset to default data (for admin use)
export function resetToDefaultData() {
  // Clear existing data
  localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
  localStorage.removeItem(STORAGE_KEYS.BLOG);
  localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
  localStorage.removeItem(STORAGE_KEYS.PRESS);
  
  // Re-initialize with default data
  initializeStorage();
}
