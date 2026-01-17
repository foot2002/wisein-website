# Supabase 테이블 자동 생성 가이드

## 완료! ✅

Supabase CLI를 사용하여 모든 테이블이 자동으로 생성되었습니다.

## 생성된 테이블

- ✅ portfolio
- ✅ blog
- ✅ inquiries
- ✅ announcements
- ✅ press_releases
- ✅ newsletter_subscribers

## 다음에 자동으로 실행하는 방법

### 방법 1: npm 스크립트 사용 (권장)

```bash
npm run setup:supabase
```

### 방법 2: 직접 실행

```bash
node scripts/autoSetupSupabase.mjs
```

## 환경 변수 설정 (선택사항)

`.env.local`에 Access Token을 추가하면 더 편리합니다:

```env
SUPABASE_ACCESS_TOKEN=sbp_4f3a2d82c9ad5e5a0ff432c2dd5946de08f96d00
```

이렇게 하면 스크립트가 자동으로 Access Token을 사용합니다.

## 참고

- 테이블은 이미 생성되었으므로 다시 실행할 필요가 없습니다
- 마이그레이션 파일은 `supabase/migrations/20240101000000_initial_schema.sql`에 있습니다
- 테이블 구조를 변경하려면 마이그레이션 파일을 수정하고 `npm run setup:supabase`를 다시 실행하세요
