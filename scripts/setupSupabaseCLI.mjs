// Supabase CLI를 사용한 테이블 생성 스크립트
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found');
  process.exit(1);
}

const projectMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!projectMatch) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const projectId = projectMatch[1];

console.log('🚀 Supabase CLI를 사용한 테이블 생성\n');
console.log('📋 프로젝트 ID:', projectId);
console.log('📋 프로젝트 URL:', supabaseUrl);
console.log('\n');

// Supabase CLI 명령 실행
try {
  console.log('1️⃣  Supabase 프로젝트 연결 중...\n');
  
  // Service Role Key를 사용하여 연결 시도
  // 하지만 Supabase CLI는 Access Token이 필요합니다
  console.log('⚠️  Supabase CLI는 Access Token이 필요합니다.');
  console.log('💡 다음 방법을 사용하세요:\n');
  
  console.log('방법 1: Supabase Dashboard SQL Editor 사용 (가장 빠름)');
  console.log('   1. https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/sql/new 접속');
  console.log('   2. supabase-schema.sql 파일 내용 복사/붙여넣기');
  console.log('   3. Run 버튼 클릭\n');
  
  console.log('방법 2: Supabase CLI 수동 설정');
  console.log('   1. npx supabase login');
  console.log('   2. npx supabase link --project-ref kehgopppnjqxjfjuiyvy');
  console.log('   3. npx supabase db push\n');
  
  console.log('📋 실행할 SQL:\n');
  const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  console.log(sql.substring(0, 500) + '...\n');
  console.log('💡 전체 SQL은 supabase-schema.sql 파일을 참고하세요.');
  
} catch (error) {
  console.error('❌ 오류:', error.message);
  process.exit(1);
}
