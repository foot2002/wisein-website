// Supabase 테이블 생성 스크립트 (REST API 사용)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!supabaseAnonKey && !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

// 서비스 역할 키가 있으면 사용, 없으면 anon key 사용
const key = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, key);

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');
  console.log('📋 Supabase REST API를 사용하여 테이블 생성...\n');

  // Supabase는 직접 SQL 실행 API를 제공하지 않으므로
  // 각 테이블을 개별적으로 생성해야 합니다.
  
  const tables = [
    {
      name: 'portfolio',
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
    },
    {
      name: 'blog',
      sql: `
        CREATE TABLE IF NOT EXISTS blog (
          id BIGSERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT,
          author TEXT NOT NULL,
          date TEXT NOT NULL,
          read_time TEXT NOT NULL,
          image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'inquiries',
      sql: `
        CREATE TABLE IF NOT EXISTS inquiries (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT NOT NULL,
          phone TEXT NOT NULL,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          reply TEXT,
          replied_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied'))
        );
      `
    },
    {
      name: 'announcements',
      sql: `
        CREATE TABLE IF NOT EXISTS announcements (
          id BIGSERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'press_releases',
      sql: `
        CREATE TABLE IF NOT EXISTS press_releases (
          id BIGSERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          source TEXT NOT NULL,
          url TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'newsletter_subscribers',
      sql: `
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];

  console.log('⚠️  Supabase JavaScript 클라이언트는 직접 SQL을 실행할 수 없습니다.');
  console.log('📝 다음 방법 중 하나를 사용하세요:\n');
  console.log('1. Supabase Dashboard → SQL Editor에서 supabase-schema.sql 실행 (권장)');
  console.log('2. .env.local에 SUPABASE_DB_PASSWORD 추가 후 scripts/setupSupabaseTables.mjs 실행');
  console.log('3. Supabase CLI 사용: npx supabase db push\n');
  
  console.log('💡 가장 빠른 방법:');
  console.log('   1. https://app.supabase.com 접속');
  console.log('   2. 프로젝트 선택');
  console.log('   3. 좌측 메뉴 → SQL Editor');
  console.log('   4. supabase-schema.sql 파일 내용 복사/붙여넣기');
  console.log('   5. Run 버튼 클릭\n');
  
  console.log('📋 생성할 테이블 목록:');
  tables.forEach(table => {
    console.log(`   - ${table.name}`);
  });
}

createTables();
