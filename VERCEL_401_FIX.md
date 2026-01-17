# Vercel 401 오류 해결 가이드

## 문제
Vercel에 배포된 웹사이트에서 Supabase 401 오류가 발생합니다:
```
Failed to load resource: the server responded with a status of 401
Error fetching announcements from Supabase: Object
Error fetching press releases from Supabase: Object
```

## 원인
1. **Supabase RLS 정책 문제**: Row Level Security 정책이 제대로 설정되지 않음
2. **환경 변수 문제**: Vercel에 환경 변수가 설정되지 않았거나 빌드에 포함되지 않음
3. **Anon Key 문제**: 잘못된 Anon Key 사용

## 해결 방법

### 1단계: Supabase RLS 정책 확인 및 재설정

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **SQL Editor** 메뉴 클릭
4. `fix-supabase-rls.sql` 파일의 내용을 복사하여 실행
5. **Run** 버튼 클릭

### 2단계: Vercel 환경 변수 확인

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 환경 변수가 있는지 확인:
   - `VITE_SUPABASE_URL` = `https://kehgopppnjqxjfjuiyvy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `ssb_publishable_syN4_2cKzuI1wscAiz6KpA_3gtOhIUg`
5. **Environment**: Production, Preview, Development 모두 선택되어 있는지 확인

### 3단계: Vercel 재배포

환경 변수를 확인/수정한 후:

1. **Deployments** 탭으로 이동
2. 최신 배포 옆의 **⋯** 메뉴 클릭
3. **Redeploy** 선택
4. 또는 새 커밋을 푸시하여 자동 재배포

### 4단계: 빌드 로그 확인

재배포 후 **Deployments** → 최신 배포 → **Build Logs** 확인:

1. 환경 변수가 빌드에 포함되었는지 확인
2. 빌드 오류가 없는지 확인
3. `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`가 사용되는지 확인

### 5단계: 배포된 사이트 확인

재배포 완료 후:

1. 배포된 사이트 접속
2. 브라우저 개발자 도구(F12) → Console 탭
3. 다음을 확인:
   - ❌ `Supabase credentials not found` → 환경 변수 미설정
   - ❌ `401 Unauthorized` → RLS 정책 문제 또는 Anon Key 문제
   - ✅ 데이터가 정상적으로 표시됨 → 해결 완료

## 추가 확인 사항

### Supabase Anon Key 확인

1. Supabase Dashboard → **Settings** → **API**
2. **Project API keys** 섹션에서 **anon/public** 키 확인
3. Vercel의 `VITE_SUPABASE_ANON_KEY`와 일치하는지 확인

### Supabase RLS 정책 확인

1. Supabase Dashboard → **Authentication** → **Policies**
2. 각 테이블(announcements, press_releases 등)에 정책이 있는지 확인
3. 정책이 없다면 `fix-supabase-rls.sql` 실행

## 디버깅 팁

### 브라우저 콘솔에서 확인

배포된 사이트에서 브라우저 콘솔(F12)을 열고:

```javascript
// 환경 변수 확인 (빌드된 파일에 포함되어 있음)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
```

### 네트워크 탭에서 확인

1. 개발자 도구(F12) → **Network** 탭
2. 페이지 새로고침
3. `supabase.co` 도메인으로 가는 요청 확인
4. **Status**: 401 → 인증 문제
5. **Status**: 200 → 정상

## 문제가 계속되면

1. Supabase Dashboard에서 **Settings** → **API** → **Project API keys** 확인
2. 새로운 Anon Key 생성 후 Vercel에 업데이트
3. Vercel에서 완전히 재배포 (캐시 클리어)
