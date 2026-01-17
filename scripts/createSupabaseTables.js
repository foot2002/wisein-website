// Supabase 테이블 생성 스크립트
// 실행: node scripts/createSupabaseTables.js

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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL 스키마 읽기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = join(__dirname, '..', 'supabase-schema.sql');
const schemaSQL = readFileSync(schemaPath, 'utf-8');

// SQL 문을 세미콜론으로 분리 (간단한 파싱)
const statements = schemaSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function createTables() {
  console.log('🚀 Supabase 테이블 생성을 시작합니다...\n');

  try {
    // 각 SQL 문을 순차적으로 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // 빈 문장이나 주석 건너뛰기
      if (!statement || statement.length < 10) continue;
      
      try {
        // Supabase는 RPC를 통해 SQL을 실행할 수 없으므로
        // 각 테이블을 개별적으로 생성
        if (statement.includes('CREATE TABLE')) {
          const tableName = extractTableName(statement);
          console.log(`📦 테이블 생성 중: ${tableName}`);
          
          // 테이블이 이미 존재하는지 확인
          const { data: existing, error: checkError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (existing !== null && checkError === null) {
            console.log(`   ⚠️  테이블 ${tableName}이 이미 존재합니다. 건너뜁니다.`);
            continue;
          }
        }
      } catch (err) {
        // 테이블이 없으면 생성 시도
      }
    }

    // Supabase Management API를 사용할 수 없으므로
    // 직접 SQL을 실행하는 대신, 각 테이블을 수동으로 생성하는 방법을 안내
    console.log('\n⚠️  Supabase는 anon key로 직접 SQL을 실행할 수 없습니다.');
    console.log('📝 다음 방법 중 하나를 선택하세요:\n');
    console.log('방법 1: Supabase Dashboard 사용');
    console.log('   1. https://supabase.com/dashboard 접속');
    console.log('   2. 프로젝트 선택');
    console.log('   3. SQL Editor 메뉴 클릭');
    console.log('   4. supabase-schema.sql 파일의 내용을 복사하여 붙여넣기');
    console.log('   5. Run 버튼 클릭\n');
    
    console.log('방법 2: Supabase CLI 사용 (권장)');
    console.log('   supabase db push --file supabase-schema.sql\n');

    // 대신 각 테이블을 직접 생성 시도 (RPC 사용)
    await createTablesDirectly();
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

function extractTableName(createTableStatement) {
  const match = createTableStatement.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
  return match ? match[1] : null;
}

async function createTablesDirectly() {
  console.log('\n🔄 직접 테이블 생성을 시도합니다...\n');

  const tables = [
    {
      name: 'portfolio',
      columns: {
        id: 'bigserial primary key',
        category: 'text not null',
        client: 'text not null',
        title: 'text not null',
        description: 'text not null',
        year: 'text not null',
        tags: 'text[] default \'{}\'',
        image_url: 'text',
        created_at: 'timestamptz default now()',
        updated_at: 'timestamptz default now()'
      }
    },
    {
      name: 'blog',
      columns: {
        id: 'bigserial primary key',
        category: 'text not null',
        title: 'text not null',
        excerpt: 'text not null',
        content: 'text',
        author: 'text not null',
        date: 'text not null',
        read_time: 'text not null',
        image_url: 'text',
        created_at: 'timestamptz default now()',
        updated_at: 'timestamptz default now()'
      }
    },
    {
      name: 'inquiries',
      columns: {
        id: 'bigserial primary key',
        name: 'text not null',
        email: 'text not null',
        company: 'text not null',
        phone: 'text not null',
        type: 'text not null',
        message: 'text not null',
        reply: 'text',
        replied_at: 'timestamptz',
        created_at: 'timestamptz default now()',
        status: 'text default \'pending\' check (status in (\'pending\', \'replied\'))'
      }
    },
    {
      name: 'announcements',
      columns: {
        id: 'bigserial primary key',
        title: 'text not null',
        date: 'text not null',
        category: 'text not null',
        content: 'text not null',
        created_at: 'timestamptz default now()',
        updated_at: 'timestamptz default now()'
      }
    },
    {
      name: 'press_releases',
      columns: {
        id: 'bigserial primary key',
        title: 'text not null',
        date: 'text not null',
        source: 'text not null',
        url: 'text not null',
        created_at: 'timestamptz default now()',
        updated_at: 'timestamptz default now()'
      }
    },
    {
      name: 'newsletter_subscribers',
      columns: {
        id: 'bigserial primary key',
        email: 'text not null unique',
        created_at: 'timestamptz default now()'
      }
    }
  ];

  // Supabase는 anon key로 테이블을 직접 생성할 수 없으므로
  // 사용자에게 SQL Editor 사용을 안내
  console.log('⚠️  Supabase는 보안상의 이유로 anon key로 테이블을 직접 생성할 수 없습니다.');
  console.log('📋 다음 SQL을 Supabase Dashboard의 SQL Editor에서 실행해주세요:\n');
  console.log('─'.repeat(60));
  console.log(readFileSync(schemaPath, 'utf-8'));
  console.log('─'.repeat(60));
  console.log('\n✅ 위 SQL을 복사하여 Supabase Dashboard > SQL Editor에서 실행하세요.');
}

// 스크립트 실행
createTables();
