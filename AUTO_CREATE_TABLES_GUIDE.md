# Supabase 테이블 자동 생성 가이드

## 현재 상황
Supabase는 직접 SQL 실행을 위한 공개 API를 제공하지 않아, 완전 자동화가 어렵습니다.

## 가장 빠른 방법: SQL Editor 사용

### 단계별 안내
1. **Supabase Dashboard 접속**
   - https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/sql/new
   - 또는 좌측 메뉴 → SQL Editor → New query

2. **SQL 복사**
   - `supabase-schema.sql` 파일 열기
   - 전체 내용 복사 (Ctrl+A, Ctrl+C)

3. **SQL 실행**
   - SQL Editor에 붙여넣기 (Ctrl+V)
   - **Run** 버튼 클릭 (또는 Ctrl+Enter)

4. **완료 확인**
   - 좌측 메뉴 → Table Editor에서 테이블 목록 확인
   - 다음 테이블이 생성되어야 합니다:
     - portfolio
     - blog
     - inquiries
     - announcements
     - press_releases
     - newsletter_subscribers

## 대안: Supabase CLI 사용

### 1. Supabase CLI 로그인
```bash
npx supabase login
```
브라우저가 열리면 Supabase 계정으로 로그인

### 2. 프로젝트 연결
```bash
npx supabase link --project-ref kehgopppnjqxjfjuiyvy
```

### 3. 마이그레이션 실행
```bash
npx supabase db push
```

## 생성되는 테이블 구조

현재 관리자 페이지의 DB 구조와 동일하게 생성됩니다:

1. **portfolio** - 포트폴리오 프로젝트
2. **blog** - 블로그 포스트
3. **inquiries** - 고객 문의
4. **announcements** - 공지사항
5. **press_releases** - 보도자료
6. **newsletter_subscribers** - 뉴스레터 구독자

모든 테이블은 RLS(Row Level Security)가 활성화되어 있으며, 모든 사용자가 읽기/쓰기/수정/삭제가 가능합니다.

## 참고
- SQL Editor 방법이 가장 빠르고 확실합니다
- 자동화를 원하면 Supabase CLI를 설정하세요
- 네트워크 연결 문제로 PostgreSQL 직접 연결은 실패했습니다
