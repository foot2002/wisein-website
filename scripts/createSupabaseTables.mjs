// Supabase 테이블 생성 스크립트 (Management API 사용)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTablesViaManagementAPI() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');

  // Supabase Management API를 사용하려면 Access Token이 필요합니다.
  // 하지만 일반적으로는 사용할 수 없으므로, 다른 방법을 사용합니다.

  console.log('📝 Supabase에 테이블을 생성하는 가장 확실한 방법:\n');
  console.log('1️⃣  Supabase Dashboard 사용 (권장)');
  console.log('   - https://app.supabase.com 접속');
  console.log('   - 프로젝트 선택');
  console.log('   - 좌측 메뉴 → SQL Editor');
  console.log('   - supabase-schema.sql 파일 내용 복사/붙여넣기');
  console.log('   - Run 버튼 클릭\n');

  console.log('2️⃣  데이터베이스 비밀번호 사용');
  console.log('   - .env.local에 다음 추가:');
  console.log('     SUPABASE_DB_PASSWORD=your_database_password');
  console.log('   - Supabase Dashboard → Settings → Database → Connection string에서 비밀번호 확인');
  console.log('   - 그 다음 실행: node scripts/setupSupabaseTables.mjs\n');

  console.log('3️⃣  Supabase CLI 사용');
  console.log('   - npx supabase init');
  console.log('   - npx supabase link --project-ref your-project-ref');
  console.log('   - npx supabase db push\n');

  // SQL 내용 출력
  console.log('📋 실행할 SQL 내용:\n');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log('\n💡 위 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요.');
}

createTablesViaManagementAPI();
