# 빠른 시작 가이드

## 이메일 전송 기능 사용하기

### 1단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=wic@wiseinc.co.kr
SMTP_PASS=your-smtp-password
SMTP_FROM=wic@wiseinc.co.kr
PORT=3001
```

**Gmail 사용 시:**
1. Google 계정 > 보안 > 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성된 비밀번호를 `SMTP_PASS`에 입력

### 2단계: 서버 실행

**방법 1: 프론트엔드와 서버 동시 실행 (권장)**
```bash
npm run dev:all
```

**방법 2: 별도 터미널에서 실행**

터미널 1 (프론트엔드):
```bash
npm run dev
```

터미널 2 (이메일 서버):
```bash
npm run server
```

### 3단계: 확인

서버가 정상 실행되면 다음 메시지가 표시됩니다:
```
Server running on port 3001
SMTP server is ready to send emails
```

### 문제 해결

**"서버에 연결할 수 없습니다" 에러:**
- 서버가 실행 중인지 확인 (`npm run server`)
- 터미널에서 에러 메시지 확인
- `.env` 파일이 올바른지 확인

**"SMTP configuration error" 에러:**
- `.env` 파일의 SMTP 설정 확인
- Gmail 사용 시 앱 비밀번호 사용 확인
