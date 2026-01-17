// 로컬 목데이터를 Supabase DB로 마이그레이션
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Service Role Key 사용 (더 높은 권한)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                           'sb_secret_N_ymbfnPYB5w-CPu-naZEA_MNAtCCe9' ||
                           process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  console.error('💡 .env.local에 SUPABASE_SERVICE_ROLE_KEY=sb_secret_N_ymbfnPYB5w-CPu-naZEA_MNAtCCe9 추가');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 로컬 목데이터 (adminStorage.ts의 initializeStorage에서 가져옴)
const defaultPortfolio = [
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

const defaultBlog = [
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

// Announcements 목데이터
const defaultAnnouncements = [
  {
    id: 1,
    title: "2024년 신규 서비스 출시 안내",
    date: "2024-01-15",
    category: "서비스",
    content: "와이즈인컴퍼니가 2024년 새로운 AI 기반 데이터 분석 서비스를 출시합니다. 더욱 강화된 분석 기능과 사용자 친화적인 인터페이스로 업그레이드되었습니다. 자세한 내용은 서비스 페이지에서 확인하실 수 있습니다.",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: 2,
    title: "CSAP 클라우드 보안인증 획득",
    date: "2024-01-10",
    category: "인증",
    content: "와이즈인컴퍼니가 CSAP(Cloud Security Assurance Program) 클라우드 보안인증을 획득했습니다. 이를 통해 고객 데이터의 보안과 안정성을 더욱 강화할 수 있게 되었습니다.",
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: 3,
    title: "2024년 상반기 교육 프로그램 안내",
    date: "2024-01-05",
    category: "교육",
    content: "2024년 상반기 데이터 분석 및 AI 교육 프로그램을 개설합니다. 국비지원 과정으로 진행되며, 실무 중심의 커리큘럼으로 구성되어 있습니다. 자세한 일정과 신청 방법은 교육 페이지에서 확인하실 수 있습니다.",
    createdAt: new Date("2024-01-05").toISOString(),
    updatedAt: new Date("2024-01-05").toISOString(),
  },
  {
    id: 4,
    title: "시스템 점검 안내",
    date: "2023-12-20",
    category: "시스템",
    content: "2023년 12월 25일(월) 오전 2시부터 오전 6시까지 시스템 점검으로 인해 서비스 이용이 일시 중단됩니다. 불편을 드려 죄송하며, 더 나은 서비스 제공을 위해 진행되는 점검입니다.",
    createdAt: new Date("2023-12-20").toISOString(),
    updatedAt: new Date("2023-12-20").toISOString(),
  },
  {
    id: 5,
    title: "연말연시 고객센터 운영 안내",
    date: "2023-12-15",
    category: "공지",
    content: "2023년 12월 29일(금)부터 2024년 1월 1일(월)까지 연말연시로 인해 고객센터 운영이 중단됩니다. 긴급 문의사항은 이메일로 접수해 주시기 바랍니다.",
    createdAt: new Date("2023-12-15").toISOString(),
    updatedAt: new Date("2023-12-15").toISOString(),
  },
];

// Press Releases 목데이터
const defaultPressReleases = [
  {
    id: 1,
    title: "와이즈인컴퍼니, AI 기반 데이터 분석 플랫폼 출시",
    date: "2024-01-20",
    source: "매일경제",
    url: "https://www.mk.co.kr/news/business/12345678",
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
  },
  {
    id: 2,
    title: "공공기관 데이터 분석 시장 선도 기업으로 부상",
    date: "2024-01-15",
    source: "한국경제",
    url: "https://www.hankyung.com/economy/article/202401151234",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: 3,
    title: "CSAP 클라우드 보안인증 획득으로 보안 강화",
    date: "2024-01-10",
    source: "전자신문",
    url: "https://www.etnews.com/20240110000123",
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: 4,
    title: "빅데이터 분석 전문기업, 2,000개 프로젝트 달성",
    date: "2023-12-28",
    source: "조선비즈",
    url: "https://biz.chosun.com/industry/company/2023122800123",
    createdAt: new Date("2023-12-28").toISOString(),
    updatedAt: new Date("2023-12-28").toISOString(),
  },
  {
    id: 5,
    title: "AI 교육 프로그램으로 데이터 전문 인재 양성",
    date: "2023-12-20",
    source: "아시아경제",
    url: "https://www.asiae.co.kr/article/202312201234",
    createdAt: new Date("2023-12-20").toISOString(),
    updatedAt: new Date("2023-12-20").toISOString(),
  },
];

async function migrateData() {
  console.log('🚀 로컬 목데이터를 Supabase DB로 마이그레이션 시작...\n');

  const results = {
    portfolio: { success: 0, failed: 0 },
    blog: { success: 0, failed: 0 },
    announcements: { success: 0, failed: 0 },
    press: { success: 0, failed: 0 },
  };

  // Portfolio 데이터 마이그레이션
  console.log('📦 Portfolio 데이터 마이그레이션 중...\n');
  for (const item of defaultPortfolio) {
    try {
      const { error } = await supabase
        .from('portfolio')
        .upsert({
          id: item.id,
          category: item.category,
          client: item.client,
          title: item.title,
          description: item.description,
          year: item.year,
          tags: item.tags,
          image_url: item.imageUrl,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
        }, { onConflict: 'id' });
      
      if (error) throw error;
      console.log(`✅ Portfolio ${item.id}: ${item.title.substring(0, 30)}...`);
      results.portfolio.success++;
    } catch (error) {
      console.error(`❌ Portfolio ${item.id} 실패:`, error.message);
      results.portfolio.failed++;
    }
  }

  // Blog 데이터 마이그레이션
  console.log('\n📝 Blog 데이터 마이그레이션 중...\n');
  for (const post of defaultBlog) {
    try {
      const { error } = await supabase
        .from('blog')
        .upsert({
          id: post.id,
          category: post.category,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          date: post.date,
          read_time: post.readTime,
          image_url: post.imageUrl,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
        }, { onConflict: 'id' });
      
      if (error) throw error;
      console.log(`✅ Blog ${post.id}: ${post.title.substring(0, 30)}...`);
      results.blog.success++;
    } catch (error) {
      console.error(`❌ Blog ${post.id} 실패:`, error.message);
      results.blog.failed++;
    }
  }

  // Announcements 데이터 마이그레이션
  console.log('\n📢 Announcements 데이터 마이그레이션 중...\n');
  for (const announcement of defaultAnnouncements) {
    try {
      const { error } = await supabase
        .from('announcements')
        .upsert({
          id: announcement.id,
          title: announcement.title,
          date: announcement.date,
          category: announcement.category,
          content: announcement.content,
          created_at: announcement.createdAt,
          updated_at: announcement.updatedAt,
        }, { onConflict: 'id' });
      
      if (error) throw error;
      console.log(`✅ Announcement ${announcement.id}: ${announcement.title.substring(0, 30)}...`);
      results.announcements.success++;
    } catch (error) {
      console.error(`❌ Announcement ${announcement.id} 실패:`, error.message);
      results.announcements.failed++;
    }
  }

  // Press Releases 데이터 마이그레이션
  console.log('\n📰 Press Releases 데이터 마이그레이션 중...\n');
  for (const press of defaultPressReleases) {
    try {
      const { error } = await supabase
        .from('press_releases')
        .upsert({
          id: press.id,
          title: press.title,
          date: press.date,
          source: press.source,
          url: press.url,
          created_at: press.createdAt,
          updated_at: press.updatedAt,
        }, { onConflict: 'id' });
      
      if (error) throw error;
      console.log(`✅ Press Release ${press.id}: ${press.title.substring(0, 30)}...`);
      results.press.success++;
    } catch (error) {
      console.error(`❌ Press Release ${press.id} 실패:`, error.message);
      results.press.failed++;
    }
  }

  console.log('\n📊 마이그레이션 결과:');
  console.log(`   Portfolio: 성공 ${results.portfolio.success}, 실패 ${results.portfolio.failed}`);
  console.log(`   Blog: 성공 ${results.blog.success}, 실패 ${results.blog.failed}`);
  console.log(`   Announcements: 성공 ${results.announcements.success}, 실패 ${results.announcements.failed}`);
  console.log(`   Press Releases: 성공 ${results.press.success}, 실패 ${results.press.failed}`);
  console.log('\n✅ 모든 목데이터 마이그레이션 완료!\n');
}

migrateData();
