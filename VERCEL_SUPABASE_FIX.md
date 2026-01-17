# Vercel Supabase 연동 문제 해결 가이드

## 문제 상황
- Vercel에 배포된 사이트에서 관리자 페이지에서 데이터를 추가했지만
- 메인 페이지에는 반영되었지만 Supabase DB에는 반영되지 않음
- **원인: Vercel에서 환경 변수가 로드되지 않아 localStorage에만 저장됨**

## 원인 분석

### 문제의 핵심
1. `src/lib/supabase.ts`에서 환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)를 읽습니다
2. 환경 변수가 없으면 `supabase` 클라이언트가 `null`이 됩니다
3. `adminStorage.ts`의 모든 `save...()` 함수들이 `if (isSupabaseEnabled() && supabase)` 조건을 확인합니다
4. Supabase가 활성화되지 않았으면 localStorage로 fallback합니다
5. **결과: 데이터가 localStorage에만 저장되고 Supabase에는 저장되지 않음**

### 왜 메인 페이지에는 보이는가?
- 메인 페이지는 `get...()` 함수로 데이터를 읽습니다
- `get...()` 함수도 Supabase 실패 시 localStorage로 fallback합니다
- 따라서 localStorage에 저장된 데이터가 메인 페이지에 표시됩니다

## 해결 방법

### 1단계: Vercel 환경 변수 확인

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 환경 변수가 정확히 설정되어 있는지 확인:
   - `VITE_SUPABASE_URL` = `https://kehgopppnjqxjfjuiyvy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `ssb_publishable_syN4_2cKzuI1wscAiz6KpA_3gtOhIUg`
5. **Environment**: Production, Preview, Development 모두 선택되어 있는지 확인

### 2단계: 빌드 로그 확인

1. **Deployments** 탭으로 이동
2. 최신 배포 클릭
3. **Build Logs** 확인
4. 환경 변수가 빌드에 포함되었는지 확인:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

### 3단계: 배포된 사이트에서 디버깅

1. 배포된 사이트 접속: `https://wisein-website.vercel.app`
2. 브라우저 개발자 도구(F12) → **Console** 탭
3. 페이지 새로고침
4. 다음 로그 확인:
   ```
   [Supabase Debug] Environment check: {
     hasUrl: true/false,
     hasKey: true/false,
     ...
   }
   ```
   - `hasUrl: false` 또는 `hasKey: false` → 환경 변수 미설정
   - `hasUrl: true` 및 `hasKey: true` → 환경 변수 정상

### 4단계: 데이터 저장 시 로그 확인

관리자 페이지에서 새 데이터를 추가할 때 콘솔에서:
- ✅ `✅ Portfolio saved to Supabase: 123` → Supabase에 저장됨
- ⚠️ `⚠️ Supabase not enabled. Saving portfolio to localStorage only.` → localStorage에만 저장됨

### 5단계: Vercel 재배포

환경 변수를 확인/수정한 후:

1. **방법 1: 빈 커밋 푸시**
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy with env vars"
   git push origin main
   ```

2. **방법 2: Vercel 대시보드에서**
   - **Deployments** → 최신 배포 → **Redeploy**

## 확인 방법

재배포 후:

1. **브라우저 콘솔 확인**
   - `[Supabase Debug]` 로그에서 환경 변수가 로드되었는지 확인
   - `✅ ... saved to Supabase` 메시지 확인

2. **Supabase Dashboard 확인**
   - [Supabase Dashboard](https://supabase.com/dashboard) 접속
   - **Table Editor**에서 데이터가 추가되었는지 확인

3. **로컬과 배포 환경 비교**
   - 로컬: `http://localhost:8080` → Supabase에 저장됨
   - 배포: `https://wisein-website.vercel.app` → Supabase에 저장되어야 함

## 추가 디버깅

### 환경 변수 값 확인 (배포된 사이트)

배포된 사이트의 브라우저 콘솔에서:

```javascript
// 환경 변수 확인
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
```

- 값이 `undefined`이면 → 환경 변수 미설정
- 값이 있으면 → 환경 변수 정상

### localStorage 확인

브라우저 콘솔에서:

```javascript
// localStorage에 저장된 데이터 확인
console.log('Portfolio (localStorage):', JSON.parse(localStorage.getItem('admin_portfolio') || '[]'));
console.log('Blog (localStorage):', JSON.parse(localStorage.getItem('admin_blog') || '[]'));
```

## 중요 사항

⚠️ **Vite 환경 변수는 빌드 시점에 번들에 포함됩니다**
- 환경 변수를 추가/수정한 후 **반드시 재배포**해야 합니다
- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다
- 환경 변수는 빌드된 JavaScript 파일에 포함되므로, 소스 코드를 보면 값이 노출됩니다

## 문제가 계속되면

1. Vercel 환경 변수 삭제 후 다시 추가
2. 완전히 새로운 배포 생성
3. Vercel 캐시 클리어
4. Supabase Anon Key 재생성 후 Vercel에 업데이트
