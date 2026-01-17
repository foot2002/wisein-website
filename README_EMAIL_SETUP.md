# 이메일 전송 설정 가이드

## 문제 해결

이메일이 전송되지 않는 경우 다음 단계를 확인하세요.

## 1. 의존성 설치

```bash
npm install
```

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=wic@wiseinc.co.kr
SMTP_PASS=your-smtp-password-here
SMTP_FROM=wic@wiseinc.co.kr
PORT=3001
```

**Gmail 사용 시:**
- Gmail 앱 비밀번호를 생성해야 합니다
- Google 계정 > 보안 > 2단계 인증 > 앱 비밀번호
- 생성된 비밀번호를 `SMTP_PASS`에 입력

**다른 이메일 서비스 사용 시:**
- SMTP 서버 정보에 맞게 `SMTP_HOST`와 `SMTP_PORT` 수정
- 예: 네이버 (smtp.naver.com, 465), Outlook (smtp-mail.outlook.com, 587)

## 3. 서버 실행

### 방법 1: 프론트엔드와 서버 동시 실행
```bash
npm run dev:all
```

### 방법 2: 별도 터미널에서 실행
**터미널 1 (프론트엔드):**
```bash
npm run dev
```

**터미널 2 (백엔드 서버):**
```bash
npm run server
```

## 4. 확인 사항

1. 서버가 `http://localhost:3001`에서 실행 중인지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. 서버 터미널에서 에러 로그 확인

## 5. 테스트

관리자 페이지에서 문의글에 답변을 작성하고 "답변 저장 및 이메일 전송" 버튼을 클릭하세요.

성공하면 "답변이 저장되었고 이메일이 전송되었습니다." 메시지가 표시됩니다.

## 문제 해결

### "Failed to send email" 에러
- 서버가 실행 중인지 확인
- `.env` 파일의 SMTP 설정이 올바른지 확인
- SMTP 서버 연결이 가능한지 확인 (방화벽, 네트워크)

### "Connection timeout" 에러
- `SMTP_HOST`와 `SMTP_PORT`가 올바른지 확인
- 회사 방화벽이 SMTP 포트를 차단하지 않는지 확인

### "Authentication failed" 에러
- `SMTP_USER`와 `SMTP_PASS`가 올바른지 확인
- Gmail 사용 시 앱 비밀번호를 사용했는지 확인
