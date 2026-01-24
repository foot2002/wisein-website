// Supabase 연결 및 RLS 정책 확인 스크립트
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY가 필요합니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('🔍 Supabase 연결 및 RLS 정책 확인 중...\n');

  // 1. 연결 테스트
  console.log('1. 연결 테스트...');
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ 연결 오류:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        console.error('\n⚠️  RLS 정책 문제로 보입니다.');
        console.error('   fix-supabase-rls.sql 파일을 Supabase SQL Editor에서 실행하세요.');
      }
    } else {
      console.log('✅ 연결 성공');
    }
  } catch (error) {
    console.error('❌ 예외 발생:', error.message);
  }

  console.log('');

  // 2. 각 테이블별 RLS 정책 확인
  const tables = ['announcements', 'blog', 'portfolio', 'press_releases', 'inquiries', 'newsletter_subscribers'];
  
  console.log('2. 각 테이블별 접근 테스트...\n');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`❌ ${table}:`, error.message);
        if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
          console.error(`   → RLS 정책이 없거나 잘못 설정되었습니다.`);
        }
      } else {
        console.log(`✅ ${table}: 접근 가능`);
      }
    } catch (error) {
      console.error(`❌ ${table}:`, error.message);
    }
  }

  console.log('\n💡 해결 방법:');
  console.log('   1. Supabase Dashboard → SQL Editor');
  console.log('   2. fix-supabase-rls.sql 파일 내용 복사');
  console.log('   3. SQL Editor에 붙여넣고 실행');
}

checkConnection();
