# Supabase 401 오류 최종 해결 가이드

## 현재 상황 분석

배포된 사이트의 콘솔 로그를 보면:

✅ **환경 변수는 정상적으로 로드됨**:
- `hasUrl: true`
- `hasKey: true`
- URL과 Key가 모두 정상

❌ **하지만 401 오류 발생**:
- `Failed to load resource: the server responded with a status of 401`
- Supabase API 호출 시 인증 실패

✅ **데이터는 localStorage에서 가져옴**:
- 공지사항: Array(1) - localStorage에서 가져온 것
- 보도자료: Array(1) - localStorage에서 가져온 것

## 문제 원인

**Supabase RLS (Row Level Security) 정책이 제대로 설정되지 않았습니다.**

환경 변수는 정상이지만, Supabase의 RLS 정책이 없거나 잘못 설정되어 있어서 Anon Key로 접근할 수 없습니다.

## 해결 방법

### 1단계: Supabase RLS 정책 재설정 (필수)

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New query** 클릭
5. `fix-supabase-rls.sql` 파일의 **전체 내용**을 복사하여 붙여넣기
6. **Run** 버튼 클릭 (또는 Ctrl+Enter)
7. 성공 메시지 확인

### 2단계: RLS 정책 확인

SQL Editor에서 다음 쿼리를 실행하여 정책이 제대로 생성되었는지 확인:

```sql
-- RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

각 테이블에 다음 정책이 있어야 합니다:
- `Allow public read access` (SELECT)
- `Allow public insert access` (INSERT)
- `Allow public update access` (UPDATE)
- `Allow public delete access` (DELETE)

### 3단계: 직접 테스트

SQL Editor에서 다음 쿼리로 직접 테스트:

```sql
-- Anon 역할로 테스트 (RLS 정책 확인)
SET ROLE anon;
SELECT * FROM announcements LIMIT 1;
RESET ROLE;
```

- 오류가 나면 → RLS 정책 문제
- 정상 작동하면 → 정책 정상

### 4단계: 배포된 사이트 확인

RLS 정책을 재설정한 후:

1. 배포된 사이트 새로고침
2. 브라우저 콘솔(F12) 확인
3. 401 오류가 사라졌는지 확인
4. 데이터가 Supabase에서 가져와지는지 확인

## 확인 방법

### 브라우저 콘솔에서 확인

재배포 후 배포된 사이트에서:

1. **환경 변수 확인** (이미 정상):
   ```
   [Supabase Debug] Environment check: {
     hasUrl: true,
     hasKey: true,
     ...
   }
   ```

2. **401 오류 확인**:
   - ❌ 이전: `Failed to load resource: the server responded with a status of 401`
   - ✅ 정상: 401 오류 없음

3. **데이터 소스 확인**:
   - ❌ 이전: `공지사항 데이터: Array(1)` (localStorage에서)
   - ✅ 정상: Supabase에서 직접 가져옴 (네트워크 탭에서 확인)

### 네트워크 탭에서 확인

1. 개발자 도구(F12) → **Network** 탭
2. 페이지 새로고침
3. `supabase.co` 도메인으로 가는 요청 확인
4. **Status**: 
   - ❌ 401 → RLS 정책 문제
   - ✅ 200 → 정상 작동

## 문제가 계속되면

### 1. Anon Key 확인

1. Supabase Dashboard → **Settings** → **API**
2. **Project API keys** 섹션에서 **anon/public** 키 확인
3. Vercel의 `VITE_SUPABASE_ANON_KEY`와 일치하는지 확인
4. 다르면 Vercel에 올바른 키로 업데이트

### 2. RLS 정책 완전 삭제 후 재생성

SQL Editor에서:

```sql
-- 모든 정책 삭제
DROP POLICY IF EXISTS "Allow public read access" ON portfolio;
DROP POLICY IF EXISTS "Allow public read access" ON blog;
-- ... (모든 정책 삭제)

-- RLS 비활성화
ALTER TABLE portfolio DISABLE ROW LEVEL SECURITY;
-- ... (모든 테이블)

-- fix-supabase-rls.sql 다시 실행
```

### 3. Supabase 프로젝트 재생성 (최후의 수단)

1. 새 Supabase 프로젝트 생성
2. `supabase-schema.sql` 실행
3. `fix-supabase-rls.sql` 실행
4. Vercel 환경 변수 업데이트
5. 재배포

## 중요 사항

⚠️ **RLS 정책은 Supabase에서 직접 설정해야 합니다**
- 코드로는 RLS 정책을 생성할 수 없습니다
- Supabase Dashboard의 SQL Editor에서만 가능합니다
- `fix-supabase-rls.sql` 파일을 실행하면 모든 정책이 재설정됩니다

## 다음 단계

1. ✅ `fix-supabase-rls.sql` 실행 (Supabase SQL Editor)
2. ✅ 배포된 사이트 새로고침
3. ✅ 브라우저 콘솔에서 401 오류 확인
4. ✅ Supabase Dashboard에서 데이터 확인
