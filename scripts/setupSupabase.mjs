// Supabase 테이블 생성 스크립트 (ESM)
// 실행: node scripts/setupSupabase.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { config } from 'dotenv';

// .env.local 파일 로드
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 .env.local에 설정해주세요.');
  process.exit(1);
}

console.log('✅ Supabase 연결 정보 확인됨');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL 스키마 읽기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = join(__dirname, '..', 'supabase-schema.sql');
const schemaSQL = readFileSync(schemaPath, 'utf-8');

async function setupSupabase() {
  console.log('🚀 Supabase 테이블 설정을 시작합니다...\n');

  // Supabase는 anon key로 직접 SQL을 실행할 수 없으므로
  // 사용자에게 SQL Editor 사용을 안내
  console.log('📋 다음 SQL을 Supabase Dashboard의 SQL Editor에서 실행해주세요:\n');
  console.log('─'.repeat(70));
  console.log(schemaSQL);
  console.log('─'.repeat(70));
  console.log('\n📝 실행 방법:');
  console.log('   1. https://supabase.com/dashboard 접속');
  console.log('   2. 프로젝트 선택');
  console.log('   3. 좌측 메뉴에서 "SQL Editor" 클릭');
  console.log('   4. 위 SQL을 복사하여 붙여넣기');
  console.log('   5. "Run" 버튼 클릭\n');

  // 연결 테스트
  console.log('🔍 Supabase 연결 테스트 중...');
  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase.from('portfolio').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ 연결 성공! (테이블이 아직 생성되지 않았습니다 - 정상)');
    } else if (error) {
      console.log(`⚠️  연결 확인: ${error.message}`);
    } else {
      console.log('✅ 연결 성공!');
    }
  } catch (err) {
    console.log(`⚠️  연결 확인 중 오류: ${err.message}`);
  }

  console.log('\n✨ 설정 완료! 위 SQL을 실행하면 테이블이 생성됩니다.');
}

setupSupabase().catch(console.error);
