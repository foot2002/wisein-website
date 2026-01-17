# Vercel 재배포 방법 가이드

## 방법 1: 새 커밋 푸시 (가장 간단)

GitHub에 빈 커밋을 푸시하면 Vercel이 자동으로 재배포합니다:

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

## 방법 2: Vercel 대시보드에서 재배포

### 최신 배포에서 재배포
1. **Deployments** 탭으로 이동
2. 최신 배포를 클릭
3. 오른쪽 상단의 **⋯** (점 3개) 메뉴 클릭
4. **Redeploy** 선택

### 특정 배포에서 재배포
1. **Deployments** 탭에서 원하는 배포 찾기
2. 배포 카드 오른쪽의 **⋯** 메뉴 클릭
3. **Redeploy** 선택

## 방법 3: 환경 변수 추가 후 자동 재배포

환경 변수를 추가/수정하면 Vercel이 자동으로 재배포를 시작할 수 있습니다:
1. **Settings** → **Environment Variables**
2. 환경 변수 추가/수정
3. **Save** 클릭
4. 자동으로 재배포가 시작되는지 확인

## 방법 4: GitHub에서 재배포 트리거

GitHub 저장소에서:
1. Actions 탭으로 이동
2. Vercel 워크플로우가 있다면 수동으로 실행
3. 또는 새 커밋을 푸시

## 방법 5: Vercel CLI 사용 (선택사항)

로컬에서 Vercel CLI를 사용하여 재배포:

```bash
# Vercel CLI 설치 (처음만)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 재배포
vercel --prod
```

## 확인 방법

재배포가 시작되면:
1. **Deployments** 탭에서 새로운 배포가 생성되는지 확인
2. 배포 상태가 **Building** → **Ready**로 변경되는지 확인
3. 배포 완료 후 배포된 사이트에서 확인

## 문제 해결

### "Redeploy" 버튼이 보이지 않는 경우
- Vercel UI가 업데이트되었을 수 있습니다
- **방법 1 (빈 커밋 푸시)**을 사용하는 것이 가장 확실합니다

### 재배포가 시작되지 않는 경우
- 환경 변수를 수정하면 자동으로 재배포가 시작될 수 있습니다
- 또는 새 커밋을 푸시하세요
