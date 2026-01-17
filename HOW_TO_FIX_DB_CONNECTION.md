# Supabase 데이터베이스 연결 문제 해결

## 문제
`getaddrinfo ENOTFOUND` 오류가 발생하는 경우, 데이터베이스 호스트 주소가 올바르지 않을 수 있습니다.

## 해결 방법

### 1. Supabase Dashboard에서 정확한 Connection String 확인

1. https://app.supabase.com 접속
2. 프로젝트 선택
3. Settings → Database
4. **Connection string** 섹션 확인
5. **Direct connection** 또는 **Connection pooling** 탭 선택
6. Connection string 예시:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   또는
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0.xxxxx.supabase.co:5432/postgres
   ```

### 2. .env.local에 호스트 정보 추가

Connection string에서 호스트 주소를 확인한 후, `.env.local`에 추가:

```env
SUPABASE_DB_PASSWORD=your_password
SUPABASE_DB_HOST=db.kehgopppnjqxjfjuiyvy.supabase.co
# 또는
# SUPABASE_DB_HOST=aws-0.kehgopppnjqxjfjuiyvy.supabase.co
```

### 3. 대안: Supabase Dashboard SQL Editor 사용

가장 확실한 방법은 Supabase Dashboard의 SQL Editor를 사용하는 것입니다:

1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 좌측 메뉴 → **SQL Editor**
4. `supabase-schema.sql` 파일 내용 복사/붙여넣기
5. **Run** 버튼 클릭

이 방법은 네트워크 연결 문제 없이 바로 테이블을 생성할 수 있습니다.
