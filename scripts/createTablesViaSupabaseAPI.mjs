// Supabase 테이블 생성 스크립트 (Management API 시도)
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) required');
  process.exit(1);
}

// Service Role Key로 클라이언트 생성 (더 높은 권한)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');
  console.log('📋 Management API를 통해 테이블 생성 시도...\n');

  // Supabase는 직접 SQL 실행 API를 제공하지 않으므로
  // 각 테이블을 개별적으로 생성해야 합니다
  
  const tables = [
    {
      name: 'portfolio',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        category: 'TEXT NOT NULL',
        client: 'TEXT NOT NULL',
        title: 'TEXT NOT NULL',
        description: 'TEXT NOT NULL',
        year: 'TEXT NOT NULL',
        tags: 'TEXT[] DEFAULT \'{}\'',
        image_url: 'TEXT',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
      }
    },
    {
      name: 'blog',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        category: 'TEXT NOT NULL',
        title: 'TEXT NOT NULL',
        excerpt: 'TEXT NOT NULL',
        content: 'TEXT',
        author: 'TEXT NOT NULL',
        date: 'TEXT NOT NULL',
        read_time: 'TEXT NOT NULL',
        image_url: 'TEXT',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
      }
    },
    {
      name: 'inquiries',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        name: 'TEXT NOT NULL',
        email: 'TEXT NOT NULL',
        company: 'TEXT NOT NULL',
        phone: 'TEXT NOT NULL',
        type: 'TEXT NOT NULL',
        message: 'TEXT NOT NULL',
        reply: 'TEXT',
        replied_at: 'TIMESTAMPTZ',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        status: 'TEXT DEFAULT \'pending\' CHECK (status IN (\'pending\', \'replied\'))'
      }
    },
    {
      name: 'announcements',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        title: 'TEXT NOT NULL',
        date: 'TEXT NOT NULL',
        category: 'TEXT NOT NULL',
        content: 'TEXT NOT NULL',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
      }
    },
    {
      name: 'press_releases',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        title: 'TEXT NOT NULL',
        date: 'TEXT NOT NULL',
        source: 'TEXT NOT NULL',
        url: 'TEXT NOT NULL',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
      }
    },
    {
      name: 'newsletter_subscribers',
      columns: {
        id: 'BIGSERIAL PRIMARY KEY',
        email: 'TEXT NOT NULL UNIQUE',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()'
      }
    }
  ];

  console.log('⚠️  Supabase JavaScript 클라이언트는 직접 SQL을 실행할 수 없습니다.');
  console.log('📝 다음 방법을 사용하세요:\n');
  
  console.log('1️⃣  Supabase Dashboard SQL Editor 사용 (가장 확실)');
  console.log('   - https://app.supabase.com/project/kehgopppnjqxjfjuiyvy/sql/new');
  console.log('   - supabase-schema.sql 내용 복사/붙여넣기');
  console.log('   - Run 클릭\n');
  
  console.log('2️⃣  Supabase CLI 사용');
  console.log('   - npx supabase link --project-ref kehgopppnjqxjfjuiyvy');
  console.log('   - npx supabase db push\n');
  
  console.log('3️⃣  PostgreSQL 클라이언트 직접 연결');
  console.log('   - Connection string에서 정확한 호스트 주소 확인 필요\n');
  
  console.log('💡 가장 빠른 방법: SQL Editor 사용\n');
  console.log('📋 실행할 SQL:\n');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
}

createTables();
