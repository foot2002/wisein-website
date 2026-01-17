# Supabase 테이블 생성 가이드

Supabase에 테이블을 생성하는 방법은 여러 가지가 있습니다.

## 방법 1: Supabase Dashboard 사용 (가장 간단)

1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 좌측 메뉴 → **SQL Editor** 클릭
4. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

## 방법 2: 데이터베이스 비밀번호 사용 (자동화)

1. Supabase Dashboard → Settings → Database → Connection string에서 비밀번호 확인
2. `.env.local`에 다음 추가:
   ```
   SUPABASE_DB_PASSWORD=your_database_password
   ```
3. 다음 명령 실행:
   ```bash
   node scripts/setupSupabaseTables.mjs
   ```

## 방법 3: Supabase CLI 사용

```bash
# Supabase CLI 설치 (이미 설치되어 있으면 생략)
npm install -g supabase

# 프로젝트 초기화
npx supabase init

# 프로젝트 연결
npx supabase link --project-ref your-project-ref

# SQL 파일 실행
npx supabase db push
```

## 생성되는 테이블

- `portfolio` - 포트폴리오 프로젝트
- `blog` - 블로그 포스트
- `inquiries` - 고객 문의
- `announcements` - 공지사항
- `press_releases` - 보도자료
- `newsletter_subscribers` - 뉴스레터 구독자

## 참고

- 모든 테이블은 RLS (Row Level Security)가 활성화되어 있습니다
- 모든 사용자가 읽기/쓰기/수정/삭제가 가능하도록 정책이 설정되어 있습니다
- `updated_at` 컬럼은 자동으로 업데이트됩니다
