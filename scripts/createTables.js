// Supabase 테이블 생성 스크립트 (REST API 사용)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');
  console.log('📋 Supabase Management API를 사용하여 테이블 생성...\n');

  try {
    // Supabase Management API 엔드포인트
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      // exec_sql 함수가 없을 수 있으므로, 다른 방법을 시도합니다.
      console.log('⚠️  exec_sql 함수를 사용할 수 없습니다.');
      console.log('📝 Supabase Dashboard의 SQL Editor를 사용하세요.\n');
      console.log('SQL 내용:');
      console.log('─'.repeat(50));
      console.log(sql);
      console.log('─'.repeat(50));
      return;
    }

    const result = await response.json();
    console.log('✅ 테이블 생성 완료!');
    console.log(result);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.log('\n💡 Supabase Dashboard의 SQL Editor를 사용하세요:');
    console.log('   1. https://app.supabase.com 접속');
    console.log('   2. 프로젝트 선택');
    console.log('   3. SQL Editor 열기');
    console.log('   4. 아래 SQL 실행:\n');
    console.log('─'.repeat(50));
    console.log(sql);
    console.log('─'.repeat(50));
  }
}

createTables();
