import { Building2, Landmark, MapPin, GraduationCap } from "lucide-react";

interface ClientCategory {
  id: string;
  label: string;
  icon: typeof Building2;
  clients: string[];
  direction: "right-to-left" | "left-to-right";
}

const categories: ClientCategory[] = [
  {
    id: "enterprise",
    label: "기업",
    icon: Building2,
    clients: [
      "삼성전자",
      "LG전자",
      "LG유플러스",
      "현대건설",
      "대우건설",
      "롯데",
      "CJ E&M",
      "CJ CGV",
      "SBS",
      "KBS",
      "MBC 아카데미",
      "중앙일보",
      "한국경제신문",
      "하나은행",
      "신한금융그룹",
    ],
    direction: "right-to-left", // 오른쪽에서 왼쪽으로
  },
  {
    id: "public",
    label: "공공",
    icon: Landmark,
    clients: [
      "기획재정부",
      "교육부",
      "고용노동부",
      "보건복지부",
      "국방부",
      "행정안전부",
      "법무부",
      "중소벤처기업부",
      "통계청",
      "LH 한국토지주택공사",
      "인천국제공항공사",
      "한국전력공사",
      "한국도로공사",
      "한국철도공사",
      "한국수자원공사",
      "한국공항공사",
      "한국조폐공사",
      "한국마사회",
    ],
    direction: "left-to-right", // 왼쪽에서 오른쪽으로
  },
  {
    id: "local",
    label: "지자체",
    icon: MapPin,
    clients: [
      "서울특별시",
      "경기도청",
      "전라남도",
      "성남시",
      "과천시",
      "오산시",
      "용산구",
      "서초구",
      "영등포구",
      "성동구",
    ],
    direction: "right-to-left", // 오른쪽에서 왼쪽으로
  },
  {
    id: "university",
    label: "대학/병원",
    icon: GraduationCap,
    clients: [
      "서울대학교",
      "연세대학교",
      "고려대학교",
      "한양대학교",
      "경희대학교",
      "중앙대학교",
      "성균관대학교",
      "서울대학병원",
      "서울아산병원",
      "가톨릭대학교 의료원",
      "국립암센터",
    ],
    direction: "left-to-right", // 왼쪽에서 오른쪽으로
  },
];

export function ScrollingClients() {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-4 overflow-hidden">
          {/* 카테고리 버튼 - 왼쪽 고정 */}
          <div className="flex-shrink-0 z-10">
            <button className="flex items-center gap-2 px-4 py-3 bg-accent/90 text-white rounded-lg font-semibold text-sm whitespace-nowrap shadow-lg hover:bg-accent transition-colors">
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          </div>

          {/* 스크롤링 클라이언트 리스트 */}
          <div className="flex-1 overflow-hidden">
            <div
              className={`flex gap-4 ${
                category.direction === "right-to-left"
                  ? "animate-scroll-right"
                  : "animate-scroll-left"
              }`}
              style={{
                width: "fit-content",
              }}
            >
              {/* 원본 리스트 */}
              {category.clients.map((client, idx) => (
                <div
                  key={`${client}-${idx}`}
                  className="flex-shrink-0 bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2.5 flex items-center justify-center"
                  style={{ 
                    width: "calc(180px * 2/3)", 
                    minWidth: "calc(180px * 2/3)",
                    height: "calc(60px * 2/3)"
                  }}
                >
                  <span className="text-primary-foreground/90 font-medium text-center text-xs whitespace-nowrap">
                    {client}
                  </span>
                </div>
              ))}
              {/* 무한 스크롤을 위한 복제 */}
              {category.clients.map((client, idx) => (
                <div
                  key={`${client}-dup-${idx}`}
                  className="flex-shrink-0 bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2.5 flex items-center justify-center"
                  style={{ 
                    width: "calc(180px * 2/3)", 
                    minWidth: "calc(180px * 2/3)",
                    height: "calc(60px * 2/3)"
                  }}
                >
                  <span className="text-primary-foreground/90 font-medium text-center text-xs whitespace-nowrap">
                    {client}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
