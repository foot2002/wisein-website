// Supabase 테이블 생성 스크립트
// PostgreSQL 클라이언트를 사용하여 직접 SQL 실행
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseDbPassword = process.env.SUPABASE_DB_PASSWORD;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

// Supabase URL에서 프로젝트 ID 추출
// URL 형식: https://xxxxx.supabase.co
const projectMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!projectMatch) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const projectId = projectMatch[1];

// Supabase Connection string에서 호스트를 직접 지정할 수 있습니다
// .env.local에 SUPABASE_DB_HOST를 추가하거나, 기본값 사용
const dbHost = process.env.SUPABASE_DB_HOST || `db.${projectId}.supabase.co`;
const dbPort = parseInt(process.env.SUPABASE_DB_PORT || '5432');
const dbName = process.env.SUPABASE_DB_NAME || 'postgres';
const dbUser = process.env.SUPABASE_DB_USER || 'postgres';

// 데이터베이스 비밀번호 또는 서비스 역할 키 필요
if (!supabaseDbPassword && !supabaseServiceKey) {
  console.error('❌ SUPABASE_DB_PASSWORD or SUPABASE_SERVICE_ROLE_KEY required');
  console.error('💡 Supabase Dashboard → Settings → Database → Connection string에서 비밀번호 확인');
  process.exit(1);
}

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');
  console.log(`📡 연결 중: ${dbHost}:${dbPort}/${dbName}\n`);

  // PostgreSQL 클라이언트 생성
  const client = new Client({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: supabaseDbPassword || supabaseServiceKey,
    ssl: {
      rejectUnauthorized: false, // Supabase는 SSL 필요
    },
  });

  try {
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공!\n');

    // SQL을 세미콜론으로 분리하여 각각 실행
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 ${statements.length}개의 SQL 문 실행 중...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      try {
        await client.query(statement);
        // 간단한 로그 (너무 많은 출력 방지)
        if (statement.includes('CREATE TABLE')) {
          const tableMatch = statement.match(/CREATE TABLE.*?(\w+)/i);
          if (tableMatch) {
            console.log(`✅ 테이블 생성: ${tableMatch[1]}`);
          }
        } else if (statement.includes('CREATE POLICY')) {
          const policyMatch = statement.match(/CREATE POLICY.*?"([^"]+)"/i);
          if (policyMatch) {
            console.log(`✅ 정책 생성: ${policyMatch[1]}`);
          }
        } else if (statement.includes('CREATE FUNCTION') || statement.includes('CREATE OR REPLACE FUNCTION')) {
          console.log(`✅ 함수 생성: update_updated_at_column`);
        } else if (statement.includes('CREATE TRIGGER')) {
          const triggerMatch = statement.match(/CREATE TRIGGER.*?(\w+)/i);
          if (triggerMatch) {
            console.log(`✅ 트리거 생성: ${triggerMatch[1]}`);
          }
        }
      } catch (error) {
        // 이미 존재하는 경우 무시
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`⚠️  이미 존재함: ${statement.substring(0, 50)}...`);
        } else {
          console.error(`❌ 오류 (${i + 1}/${statements.length}):`, error.message);
          console.error(`   SQL: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log('\n✅ 모든 테이블 생성 완료!\n');

    // 테이블 목록 확인
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📊 생성된 테이블 목록:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 데이터베이스 비밀번호가 올바르지 않습니다.');
      console.error('   Supabase Dashboard → Settings → Database → Connection string에서 비밀번호 확인');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 데이터베이스 연결에 실패했습니다.');
      console.error('   네트워크 연결 및 Supabase 프로젝트 상태를 확인하세요.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 연결 종료');
  }
}

createTables();
