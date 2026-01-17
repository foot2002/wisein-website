# 환경 변수 설정 가이드

## 문제
콘솔에 "Supabase credentials not found. Falling back to localStorage." 경고가 표시되고, 데이터가 빈 배열로 나옵니다.

## 해결 방법

### 1. 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**예시:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Vercel 배포 환경

Vercel에 배포한 경우, Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 환경 변수 추가:
   - `VITE_SUPABASE_URL` = `your_supabase_project_url`
   - `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
4. Environment 선택: Production, Preview, Development 모두 선택
5. Save 후 재배포

### 3. GitHub Pages 배포 환경

GitHub Actions를 사용하는 경우, GitHub Secrets에 환경 변수를 추가하세요:

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. New repository secret 추가:
   - `VITE_SUPABASE_URL` = `your_supabase_project_url`
   - `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`

`.github/workflows/deploy.yml` 파일이 이미 환경 변수를 사용하도록 설정되어 있습니다.

## 중요 사항

- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다.
- 환경 변수는 빌드 시점에 번들에 포함됩니다.
- `.env.local` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨).
- 환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다.

## 확인 방법

1. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. 브라우저 콘솔 확인:
   - 경고 메시지가 사라지고 데이터가 표시되어야 합니다.
   - `공지사항 데이터: Array(5)` 같은 로그가 보여야 합니다.

3. 환경 변수 확인 스크립트 실행:
   ```bash
   node scripts/checkSupabaseData.mjs
   ```
