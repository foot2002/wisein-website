// Supabase 테이블 생성 스크립트
import { createClient } from '@supabase/supabase-js';
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
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

// 서비스 역할 키로 클라이언트 생성 (테이블 생성 권한 필요)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

// SQL을 세미콜론으로 분리하여 각각 실행
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function executeSQL() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');

  try {
    // Supabase는 직접 SQL 실행 API를 제공하지 않으므로
    // RPC 함수를 사용하거나, 각 테이블을 개별적으로 생성해야 합니다.
    // 대신 Supabase Management API를 사용하거나, 
    // 또는 각 테이블을 개별적으로 생성하는 방법을 사용합니다.

    // 방법 1: 각 테이블을 개별적으로 생성
    console.log('📋 테이블 생성 중...\n');

    // Portfolio 테이블
    const { error: portfolioError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS portfolio (
          id BIGSERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          client TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          year TEXT NOT NULL,
          tags TEXT[] DEFAULT '{}',
          image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (portfolioError) {
      console.log('⚠️  Portfolio 테이블 생성 시도 (이미 존재할 수 있음)');
    } else {
      console.log('✅ Portfolio 테이블 생성 완료');
    }

    // 다른 방법: 직접 SQL을 실행할 수 있는 방법이 없으므로
    // 사용자에게 Supabase Dashboard에서 SQL을 실행하도록 안내하거나
    // Supabase CLI를 사용해야 합니다.

    console.log('\n⚠️  Supabase JavaScript 클라이언트는 직접 SQL을 실행할 수 없습니다.');
    console.log('📝 다음 방법 중 하나를 사용하세요:\n');
    console.log('1. Supabase Dashboard → SQL Editor에서 supabase-schema.sql 파일의 내용을 실행');
    console.log('2. Supabase CLI 사용: supabase db push');
    console.log('3. 또는 아래 스크립트를 사용하여 각 테이블을 개별적으로 생성\n');

    // 대안: 각 테이블을 개별적으로 생성하는 헬퍼 함수
    await createTablesIndividually();

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.log('\n💡 대안: Supabase Dashboard의 SQL Editor에서 supabase-schema.sql 파일의 내용을 직접 실행하세요.');
    process.exit(1);
  }
}

async function createTablesIndividually() {
  // 이 방법은 작동하지 않을 수 있습니다.
  // Supabase는 테이블 생성을 위한 직접적인 API를 제공하지 않습니다.
  // 대신 사용자에게 SQL Editor를 사용하도록 안내합니다.
  
  console.log('📝 Supabase Dashboard에서 SQL을 실행하는 것이 가장 확실한 방법입니다.');
  console.log('   Dashboard → SQL Editor → supabase-schema.sql 내용 붙여넣기 → 실행\n');
}

// 실행
executeSQL();
