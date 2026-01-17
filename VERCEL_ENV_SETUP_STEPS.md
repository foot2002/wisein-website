# Vercel 환경 변수 설정 단계별 가이드

## 현재 상황
Vercel 대시보드에 환경 변수가 설정되지 않았습니다. 다음 단계를 따라 설정하세요.

## 설정 방법

### 1단계: "Add Environment Variable" 버튼 클릭

### 2단계: 첫 번째 환경 변수 추가

**Key:**
```
VITE_SUPABASE_URL
```

**Value:**
```
https://kehgopppnjqxjfjuiyvy.supabase.co
```

**Environment:**
- ✅ Production
- ✅ Preview  
- ✅ Development

모두 선택 후 **Save** 클릭

### 3단계: 두 번째 환경 변수 추가

다시 "Add Environment Variable" 버튼 클릭

**Key:**
```
VITE_SUPABASE_ANON_KEY
```

**Value:**
(아래 명령어로 확인하거나 .env.local 파일에서 복사)
```
ssb_publishable_syN4...
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

모두 선택 후 **Save** 클릭

### 4단계: 재배포

환경 변수를 추가한 후:

1. **Deployments** 탭으로 이동
2. 최신 배포 옆의 **⋯** 메뉴 클릭
3. **Redeploy** 선택

또는 자동 재배포를 위해 새 커밋을 푸시:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## 확인 방법

재배포 후 배포된 사이트에서:

1. 브라우저 개발자 도구(F12) → Console 탭
2. `Supabase credentials not found` 경고가 사라졌는지 확인
3. 공지사항 페이지에서 데이터가 정상적으로 표시되는지 확인

## 중요 사항

⚠️ **환경 변수는 빌드 시점에 포함됩니다**
- 환경 변수를 추가한 후 **반드시 재배포**해야 합니다
- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다
- Production, Preview, Development 모두 선택하는 것을 권장합니다
