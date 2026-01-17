// Supabase 테이블 생성 스크립트 (Service Role Key 사용)
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
const projectMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!projectMatch) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const projectId = projectMatch[1];

// Supabase 데이터베이스 호스트 (여러 가능한 형식 시도)
const possibleHosts = [
  `db.${projectId}.supabase.co`,
  `aws-0.${projectId}.supabase.co`,
  `${projectId}.supabase.co`,
];

const dbPort = 5432;
const dbName = 'postgres';
const dbUser = 'postgres';

// 데이터베이스 비밀번호 또는 서비스 역할 키 필요
if (!supabaseDbPassword && !supabaseServiceKey) {
  console.error('❌ SUPABASE_DB_PASSWORD or SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

// SQL 스크립트 읽기
const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function createTables() {
  console.log('🚀 Supabase 테이블 생성 시작...\n');

  // 여러 호스트 주소를 시도
  for (const dbHost of possibleHosts) {
    console.log(`📡 연결 시도: ${dbHost}:${dbPort}/${dbName}\n`);

    const client = new Client({
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: supabaseDbPassword || supabaseServiceKey,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();
      console.log(`✅ 데이터베이스 연결 성공! (${dbHost})\n`);

      // SQL을 세미콜론으로 분리하여 각각 실행
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`📋 ${statements.length}개의 SQL 문 실행 중...\n`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.length === 0) continue;

        try {
          await client.query(statement);
          
          // 성공 메시지
          if (statement.includes('CREATE TABLE')) {
            const tableMatch = statement.match(/CREATE TABLE.*?(\w+)/i);
            if (tableMatch) {
              console.log(`✅ 테이블 생성: ${tableMatch[1]}`);
              successCount++;
            }
          } else if (statement.includes('CREATE POLICY')) {
            const policyMatch = statement.match(/CREATE POLICY.*?"([^"]+)"/i);
            if (policyMatch) {
              console.log(`✅ 정책 생성: ${policyMatch[1]}`);
              successCount++;
            }
          } else if (statement.includes('CREATE FUNCTION') || statement.includes('CREATE OR REPLACE FUNCTION')) {
            console.log(`✅ 함수 생성: update_updated_at_column`);
            successCount++;
          } else if (statement.includes('CREATE TRIGGER')) {
            const triggerMatch = statement.match(/CREATE TRIGGER.*?(\w+)/i);
            if (triggerMatch) {
              console.log(`✅ 트리거 생성: ${triggerMatch[1]}`);
              successCount++;
            }
          } else if (statement.includes('ALTER TABLE') && statement.includes('ENABLE ROW LEVEL SECURITY')) {
            const tableMatch = statement.match(/ALTER TABLE.*?(\w+)/i);
            if (tableMatch) {
              console.log(`✅ RLS 활성화: ${tableMatch[1]}`);
              successCount++;
            }
          }
        } catch (error) {
          // 이미 존재하는 경우 무시
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.message.includes('does not exist')) {
            // 조용히 무시
          } else {
            console.error(`⚠️  오류 (${i + 1}/${statements.length}):`, error.message.substring(0, 100));
            errorCount++;
          }
        }
      }

      console.log(`\n✅ 완료! 성공: ${successCount}, 오류: ${errorCount}\n`);

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
        console.log(`   ✓ ${row.table_name}`);
      });

      await client.end();
      console.log('\n👋 연결 종료');
      return; // 성공하면 종료

    } catch (error) {
      console.log(`❌ ${dbHost} 연결 실패: ${error.message}\n`);
      
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        // 다음 호스트 시도
        continue;
      } else if (error.message.includes('password authentication failed')) {
        console.error('💡 데이터베이스 비밀번호가 올바르지 않습니다.');
        console.error('   .env.local의 SUPABASE_DB_PASSWORD를 확인하세요.');
        process.exit(1);
      } else {
        console.error('💡 예상치 못한 오류:', error.message);
        process.exit(1);
      }
    }
  }

  console.error('❌ 모든 호스트 주소 시도 실패');
  console.error('💡 Supabase Dashboard → Settings → Database → Connection string에서 정확한 호스트 주소를 확인하세요.');
  process.exit(1);
}

createTables();
