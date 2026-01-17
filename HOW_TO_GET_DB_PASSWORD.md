# Supabase 데이터베이스 비밀번호 확인 방법

## 1. Supabase Dashboard 접속

1. https://app.supabase.com 접속
2. 프로젝트 선택 (kehgopppnjqxjfjuiyvy)

## 2. 데이터베이스 비밀번호 확인

### 방법 A: Connection String에서 확인 (권장)

1. 좌측 메뉴에서 **Settings** (⚙️) 클릭
2. **Database** 메뉴 클릭
3. **Connection string** 섹션으로 스크롤
4. **Connection pooling** 또는 **Direct connection** 탭 선택
5. Connection string 형식:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.kehgopppnjqxjfjuiyvy.supabase.co:5432/postgres
   ```
6. `[YOUR-PASSWORD]` 부분이 데이터베이스 비밀번호입니다

### 방법 B: Database Settings에서 확인

1. 좌측 메뉴에서 **Settings** (⚙️) 클릭
2. **Database** 메뉴 클릭
3. **Database password** 섹션에서 비밀번호 확인
4. 비밀번호가 보이지 않으면 **Reset database password** 버튼을 클릭하여 새 비밀번호 설정

## 3. .env.local 파일에 추가

`.env.local` 파일에 다음 줄을 추가하세요:

```env
SUPABASE_DB_PASSWORD=your_actual_password_here
```

예시:
```env
VITE_SUPABASE_URL=https://kehgopppnjqxjfjuiyvy.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_DB_PASSWORD=your_database_password_here
```

## 4. 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있을 것입니다)
- 비밀번호에 특수문자가 포함되어 있으면 따옴표로 감쌀 필요는 없습니다
- 비밀번호에 공백이 있으면 그대로 사용하세요

## 5. 테이블 생성 스크립트 실행

비밀번호를 추가한 후 다음 명령을 실행하세요:

```bash
node scripts/setupSupabaseTables.mjs
```
