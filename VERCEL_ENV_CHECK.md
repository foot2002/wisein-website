# Vercel 환경 변수 확인 가이드

## Vercel 대시보드에서 확인하는 방법

Vercel에 환경 변수가 설정되어 있는지 확인하려면:

### 1. Vercel 대시보드 접속
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 (wisein-website)

### 2. 환경 변수 확인
1. **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. 다음 환경 변수가 있는지 확인:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. 환경 변수 설정 (없는 경우)
환경 변수가 없다면 추가해야 합니다:

1. **Add New** 버튼 클릭
2. **Key**: `VITE_SUPABASE_URL`
3. **Value**: `https://kehgopppnjqxjfjuiyvy.supabase.co`
4. **Environment**: Production, Preview, Development 모두 선택
5. **Save**

6. 다시 **Add New** 버튼 클릭
7. **Key**: `VITE_SUPABASE_ANON_KEY`
8. **Value**: (`.env.local` 파일에 있는 값)
9. **Environment**: Production, Preview, Development 모두 선택
10. **Save**

### 4. 재배포
환경 변수를 추가/수정한 후:
1. **Deployments** 탭으로 이동
2. 최신 배포 옆의 **⋯** 메뉴 클릭
3. **Redeploy** 선택
4. 또는 자동으로 재배포되도록 새 커밋을 푸시

## 배포된 사이트에서 확인하는 방법

### 방법 1: 브라우저 콘솔 확인
1. 배포된 사이트 접속 (예: `https://your-project.vercel.app`)
2. 개발자 도구(F12) → Console 탭
3. 다음을 확인:
   - ❌ `Supabase credentials not found. Falling back to localStorage.` → 환경 변수 미설정
   - ✅ 경고 없음 → 환경 변수 정상

### 방법 2: 네트워크 탭 확인
1. 개발자 도구(F12) → Network 탭
2. 페이지 새로고침
3. `supabase.co` 도메인으로 요청이 가는지 확인
   - 요청이 없거나 401 오류 → 환경 변수 미설정
   - 정상 요청 (200) → 환경 변수 정상

### 방법 3: 데이터 확인
1. 공지사항 페이지 접속: `/support/announcements`
2. 콘솔에서 `공지사항 데이터: Array(5)` 확인
   - 빈 배열 `Array(0)` → 환경 변수 미설정 또는 데이터 없음
   - 데이터 있음 → 환경 변수 정상

## 중요 사항

⚠️ **환경 변수는 빌드 시점에 번들에 포함됩니다**
- 환경 변수를 추가/수정한 후 **반드시 재배포**해야 합니다
- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다
- 환경 변수는 빌드된 JavaScript 파일에 포함되므로, 소스 코드를 보면 값이 노출됩니다
- 따라서 **Anon Key는 공개되어도 안전**하도록 설계되어 있습니다 (RLS 정책으로 보호)

## 빠른 확인 체크리스트

- [ ] Vercel 대시보드에서 환경 변수 확인
- [ ] `VITE_SUPABASE_URL` 설정됨
- [ ] `VITE_SUPABASE_ANON_KEY` 설정됨
- [ ] Production, Preview, Development 모두 선택됨
- [ ] 환경 변수 추가/수정 후 재배포 완료
- [ ] 배포된 사이트에서 콘솔 경고 없음
- [ ] 데이터가 정상적으로 표시됨
