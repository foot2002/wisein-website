// Supabase 테이블 직접 생성 스크립트
// Supabase Management API를 사용하여 테이블을 자동으로 생성합니다
// 실행: node scripts/createTablesDirectly.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { config } from 'dotenv';

// .env.local 파일 로드
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('VITE_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 .env.local에 설정해주세요.');
  console.error('\n💡 참고: service_role key는 Supabase Dashboard > Settings > API에서 확인할 수 있습니다.');
  process.exit(1);
}

// Service role key로 클라이언트 생성 (관리자 권한)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SQL 스키마 읽기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = join(__dirname, '..', 'supabase-schema.sql');
const schemaSQL = readFileSync(schemaPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성을 시작합니다...\n');
  console.log(`📡 연결 URL: ${supabaseUrl.substring(0, 40)}...\n`);

  try {
    // Supabase REST API를 통해 SQL 실행
    // Supabase는 rpc를 통해 SQL을 실행할 수 있습니다
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`
      },
      body: JSON.stringify({ sql: schemaSQL })
    });

    if (!response.ok) {
      // RPC가 없으면 직접 SQL을 실행하는 다른 방법 시도
      console.log('⚠️  RPC를 통한 SQL 실행이 불가능합니다.');
      console.log('📋 대신 Supabase Dashboard의 SQL Editor를 사용하세요.\n');
      
      // 각 테이블을 개별적으로 생성 시도
      await createTablesIndividually();
      return;
    }

    const result = await response.json();
    console.log('✅ 테이블 생성 완료!');
    console.log(result);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.log('\n📋 대신 Supabase Dashboard의 SQL Editor를 사용하세요.\n');
    await createTablesIndividually();
  }
}

async function createTablesIndividually() {
  console.log('🔄 개별 테이블 생성을 시도합니다...\n');

  // Supabase는 직접 SQL 실행이 제한적이므로
  // 각 테이블을 REST API로 생성하는 것은 복잡합니다
  // 대신 사용자에게 SQL Editor 사용을 안내합니다
  
  console.log('📋 다음 SQL을 Supabase Dashboard의 SQL Editor에서 실행해주세요:\n');
  console.log('─'.repeat(70));
  console.log(schemaSQL);
  console.log('─'.repeat(70));
  console.log('\n📝 실행 방법:');
  console.log('   1. https://supabase.com/dashboard 접속');
  console.log('   2. 프로젝트 선택');
  console.log('   3. 좌측 메뉴에서 "SQL Editor" 클릭');
  console.log('   4. "New query" 클릭');
  console.log('   5. 위 SQL을 복사하여 붙여넣기');
  console.log('   6. "Run" 버튼 클릭 (또는 Ctrl+Enter)\n');
  
  // 연결 테스트
  console.log('🔍 Supabase 연결 테스트 중...');
  try {
    const { data, error } = await supabase.from('portfolio').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ 연결 성공! (테이블이 아직 생성되지 않았습니다 - 정상)');
    } else if (error) {
      console.log(`⚠️  연결 확인: ${error.message}`);
    } else {
      console.log('✅ 연결 성공! 테이블이 이미 존재할 수 있습니다.');
    }
  } catch (err) {
    console.log(`⚠️  연결 확인 중 오류: ${err.message}`);
  }
}

// 스크립트 실행
createTables().catch(console.error);
