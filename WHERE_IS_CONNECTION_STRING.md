# Supabase Connection String 찾는 방법 (업데이트)

## 현재 보이는 페이지
Database Settings 페이지에는 Connection string이 표시되지 않습니다.

## Connection String을 찾는 다른 위치

### 방법 1: Settings → API 페이지
1. 좌측 사이드바에서 **Settings** (⚙️) 클릭
2. **API** 메뉴 클릭
3. **Project API keys** 섹션에서 Connection string 확인
4. 또는 페이지 하단에 Database connection 정보가 있을 수 있음

### 방법 2: 프로젝트 Overview 페이지
1. 좌측 사이드바에서 **Home** 또는 프로젝트 이름 클릭
2. 프로젝트 Overview 페이지에서 Connection string 확인
3. "Connect to your database" 또는 "Database" 카드 확인

### 방법 3: Settings → Database 페이지의 다른 탭
1. Settings → Database 페이지에서
2. 페이지 상단에 다른 탭이 있는지 확인 (예: "Connection", "Info" 등)
3. 또는 페이지를 더 아래로 스크롤하여 Connection string 섹션 확인

### 방법 4: 직접 URL 접근
다음 URL로 직접 접근해보세요:
- `https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/settings/database`
- 또는 `https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/settings/api`

## 대안: SQL Editor 사용 (가장 간단)
Connection string을 찾지 못하더라도, SQL Editor를 사용하면 바로 테이블을 생성할 수 있습니다:

1. 좌측 사이드바에서 **SQL Editor** 클릭
2. `supabase-schema.sql` 파일 내용 복사/붙여넣기
3. **Run** 버튼 클릭

이 방법이 가장 확실하고 빠릅니다!
