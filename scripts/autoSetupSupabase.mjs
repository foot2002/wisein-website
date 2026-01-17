// Supabase 자동 설정 스크립트 (한 번에 실행)
// 이 스크립트를 실행하면 자동으로 테이블이 생성됩니다
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_4f3a2d82c9ad5e5a0ff432c2dd5946de08f96d00';

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found');
  process.exit(1);
}

const projectMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!projectMatch) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const projectId = projectMatch[1];

console.log('🚀 Supabase 테이블 자동 생성 시작...\n');
console.log('📋 프로젝트 ID:', projectId);
console.log('📋 프로젝트 URL:', supabaseUrl);
console.log('\n');

try {
  // 1. 프로젝트 연결
  console.log('1️⃣  Supabase 프로젝트 연결 중...\n');
  process.env.SUPABASE_ACCESS_TOKEN = accessToken;
  
  try {
    execSync(`npx supabase link --project-ref ${projectId}`, {
      stdio: 'inherit',
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken }
    });
    console.log('✅ 프로젝트 연결 완료!\n');
  } catch (error) {
    // 이미 연결되어 있을 수 있음
    console.log('⚠️  프로젝트가 이미 연결되어 있거나 연결 실패 (계속 진행)\n');
  }

  // 2. 마이그레이션 실행
  console.log('2️⃣  테이블 생성 중...\n');
  
  execSync(`npx supabase db push`, {
    stdio: 'inherit',
    env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken },
    input: 'Y\n' // 자동으로 Y 입력
  });
  
  console.log('\n✅ 모든 테이블 생성 완료!\n');
  console.log('📊 생성된 테이블:');
  console.log('   - portfolio');
  console.log('   - blog');
  console.log('   - inquiries');
  console.log('   - announcements');
  console.log('   - press_releases');
  console.log('   - newsletter_subscribers');
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
