// Supabase 연결 확인 및 테이블 생성 스크립트
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 정보 확인...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 .env.local에 없습니다.');
  process.exit(1);
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Anon Key:', supabaseAnonKey.substring(0, 20) + '...\n');

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 연결 테스트
async function testConnection() {
  console.log('📡 Supabase 연결 테스트 중...\n');
  
  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase.from('_realtime').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // 테이블이 없어도 연결은 성공
      console.log('⚠️  연결 테스트:', error.message);
    } else {
      console.log('✅ Supabase 연결 성공!\n');
    }
  } catch (error) {
    console.log('⚠️  연결 테스트:', error.message);
  }
  
  console.log('📝 Supabase JavaScript 클라이언트는 직접 SQL을 실행할 수 없습니다.');
  console.log('💡 테이블을 생성하려면 다음 방법 중 하나를 사용하세요:\n');
  console.log('1️⃣  Supabase Dashboard 사용 (가장 간단)');
  console.log('   - https://app.supabase.com 접속');
  console.log('   - 프로젝트 선택');
  console.log('   - SQL Editor → supabase-schema.sql 내용 실행\n');
  
  console.log('2️⃣  데이터베이스 비밀번호 추가 후 자동화 스크립트 실행');
  console.log('   - .env.local에 추가: SUPABASE_DB_PASSWORD=your_password');
  console.log('   - node scripts/setupSupabaseTables.mjs 실행\n');
  
  // SQL 내용 출력
  const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  
  console.log('📋 실행할 SQL (supabase-schema.sql):\n');
  console.log('─'.repeat(60));
  console.log(sql.substring(0, 500) + '...');
  console.log('─'.repeat(60));
  console.log('\n💡 전체 SQL은 supabase-schema.sql 파일을 참고하세요.');
}

testConnection();
