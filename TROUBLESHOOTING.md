# Supabase 환경 변수 로딩 문제 해결

## 현재 상황
- `.env.local` 파일에 환경 변수가 설정되어 있음 ✅
- 하지만 브라우저에서 "Supabase credentials not found" 경고 발생 ⚠️

## 해결 방법

### 1. 개발 서버 재시작 (가장 중요!)

Vite는 시작 시점에만 `.env.local` 파일을 읽습니다. 환경 변수를 변경하거나 추가한 후에는 **반드시 개발 서버를 재시작**해야 합니다.

```bash
# 1. 현재 실행 중인 개발 서버 중지 (Ctrl+C)
# 2. 개발 서버 재시작
npm run dev
```

### 2. 브라우저 캐시 클리어

브라우저가 이전 빌드 결과물을 캐시하고 있을 수 있습니다:

1. 브라우저에서 `Ctrl+Shift+R` (하드 리프레시)
2. 또는 개발자 도구(F12) → Network 탭 → "Disable cache" 체크

### 3. Vercel 배포 환경인 경우

Vercel에 배포한 경우, **Vercel 대시보드에서 환경 변수를 설정**해야 합니다:

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 환경 변수 추가:
   - `VITE_SUPABASE_URL` = `https://kehgopppnjqxjfjuiyvy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your_anon_key`
5. **Environment**: Production, Preview, Development 모두 선택
6. **Save** 후 **Redeploy**

### 4. 확인 방법

개발 서버 재시작 후:

1. 브라우저 콘솔(F12) 확인
   - ❌ 이전: `Supabase credentials not found. Falling back to localStorage.`
   - ✅ 정상: 경고 메시지 없음

2. 데이터 확인
   - 공지사항 페이지: `공지사항 데이터: Array(5)` (빈 배열이 아님)
   - 보도자료 페이지: `보도자료 데이터: Array(5)` (빈 배열이 아님)

3. 환경 변수 확인 스크립트 실행
   ```bash
   node scripts/verifyEnv.mjs
   ```

## 추가 정보

- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능
- 환경 변수는 빌드 시점에 번들에 포함됨
- `.env.local` 파일은 Git에 커밋되지 않음 (보안상 안전)
