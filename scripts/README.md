# Supabase 테이블 생성 스크립트

## 사용 방법

### 방법 1: Supabase Dashboard 사용 (가장 간단, 권장)

1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 좌측 메뉴 → **SQL Editor** 클릭
4. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

### 방법 2: 데이터베이스 비밀번호 사용

1. Supabase Dashboard → Settings → Database → Connection string에서 비밀번호 확인
2. `.env.local`에 다음 추가:
   ```
   SUPABASE_DB_PASSWORD=your_database_password
   ```
3. 다음 명령 실행:
   ```bash
   node scripts/setupSupabaseTables.mjs
   ```

### 방법 3: Supabase CLI 사용

```bash
# 프로젝트 연결 (프로젝트 참조 ID 필요)
npx supabase link --project-ref your-project-ref

# 마이그레이션 실행
npx supabase db push
```

## 참고

- Supabase JavaScript 클라이언트는 직접 SQL을 실행할 수 없습니다
- 가장 확실한 방법은 Supabase Dashboard의 SQL Editor를 사용하는 것입니다
- 자동화를 원하면 데이터베이스 비밀번호를 환경 변수에 추가하세요
