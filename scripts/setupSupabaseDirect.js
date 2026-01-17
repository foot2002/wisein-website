// Supabase 테이블을 직접 생성하는 스크립트
// PostgreSQL 클라이언트를 사용하여 직접 SQL 실행
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

// Supabase URL에서 연결 정보 추출
// Supabase URL 형식: https://xxxxx.supabase.co
// PostgreSQL 연결: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

// Supabase는 직접 PostgreSQL 연결을 위해 서비스 역할 키나 데이터베이스 비밀번호가 필요합니다.
// 대신 Supabase REST API를 사용하거나, 사용자에게 SQL Editor를 사용하도록 안내합니다.

console.log('📝 Supabase 테이블 생성 방법:\n');
console.log('1. Supabase Dashboard (https://app.supabase.com) 접속');
console.log('2. 프로젝트 선택');
console.log('3. 좌측 메뉴에서 "SQL Editor" 클릭');
console.log('4. supabase-schema.sql 파일의 내용을 복사하여 붙여넣기');
console.log('5. "Run" 버튼 클릭\n');

console.log('또는 Supabase CLI를 사용하세요:');
console.log('  npx supabase db push\n');
