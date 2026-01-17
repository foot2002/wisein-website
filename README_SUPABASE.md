# Supabase 연동 가이드

이 프로젝트는 Supabase를 데이터베이스로 사용하며, localStorage를 폴백으로 지원합니다.

## 설정 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase 테이블 생성

`supabase-schema.sql` 파일의 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요.

이 SQL은 다음 테이블을 생성합니다:
- `portfolio` - 포트폴리오 프로젝트
- `blog` - 블로그 포스트
- `inquiries` - 고객 문의
- `announcements` - 공지사항
- `press_releases` - 보도자료
- `newsletter_subscribers` - 뉴스레터 구독자

### 3. 데이터 마이그레이션 (선택사항)

기존 localStorage 데이터를 Supabase로 마이그레이션하려면:

1. 브라우저 콘솔에서 다음 코드를 실행하세요:

```javascript
import { migrateLocalStorageToSupabase } from './src/lib/migrateToSupabase';
await migrateLocalStorageToSupabase();
```

또는 관리자 페이지에 마이그레이션 버튼을 추가할 수 있습니다.

## 동작 방식

- **Supabase가 연결되어 있으면**: 모든 데이터는 Supabase에 저장되고, localStorage는 백업으로 사용됩니다.
- **Supabase가 연결되어 있지 않으면**: localStorage를 사용합니다 (기존 방식).

## 함수 시그니처 변경

모든 CRUD 함수가 `async`로 변경되었습니다:

```typescript
// 이전
const items = getPortfolioItems();

// 이후
const items = await getPortfolioItems();
```

기존 코드를 사용하는 모든 컴포넌트에서 `await`를 추가해야 합니다.
