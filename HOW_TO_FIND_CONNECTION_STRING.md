# Supabase Connection String 찾는 방법

## 단계별 안내

### 1. Supabase Dashboard 접속
- https://app.supabase.com 접속
- 프로젝트 선택 (WiseIN-Website 또는 kehgopppnjqxjfjuiyvy)

### 2. Settings 메뉴로 이동
- 좌측 사이드바에서 **Settings** (⚙️ 아이콘) 클릭
- 또는 프로젝트 이름 옆의 **⚙️** 아이콘 클릭

### 3. Database 메뉴 선택
- Settings 페이지에서 **Database** 메뉴 클릭
- 또는 URL: `https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/settings/database`

### 4. Connection string 섹션 찾기
- Database 설정 페이지에서 아래로 스크롤
- **Connection string** 또는 **Connection info** 섹션 찾기
- 두 가지 탭이 있을 수 있습니다:
  - **Direct connection** (직접 연결)
  - **Connection pooling** (연결 풀링)

### 5. Connection string 확인
Connection string 형식 예시:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```
또는
```
postgresql://postgres:[YOUR-PASSWORD]@aws-0.xxxxx.supabase.co:5432/postgres
```

### 6. 호스트 주소 추출
Connection string에서 `@` 뒤, `:5432` 앞의 부분이 호스트 주소입니다:
- 예: `db.kehgopppnjqxjfjuiyvy.supabase.co`
- 예: `aws-0.kehgopppnjqxjfjuiyvy.supabase.co`

## 스크린샷 위치 참고
- Settings → Database 페이지
- 페이지 중간 또는 하단에 "Connection string" 섹션
- "Show connection string" 또는 "Copy" 버튼이 있을 수 있음

## 참고
- **Direct connection**: 직접 데이터베이스 연결 (포트 5432)
- **Connection pooling**: 연결 풀링 사용 (포트 6543)
- 테이블 생성에는 **Direct connection**을 사용하는 것이 좋습니다
