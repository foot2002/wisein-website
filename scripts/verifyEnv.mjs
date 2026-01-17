// 환경 변수 확인 스크립트
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 환경 변수 확인 중...\n');

// .env.local 파일 확인
const envPath = join(__dirname, '..', '.env.local');
if (!existsSync(envPath)) {
  console.error('❌ .env.local 파일이 없습니다.');
  console.log('\n💡 .env.local 파일을 생성하고 다음 내용을 추가하세요:');
  console.log('   VITE_SUPABASE_URL=your_supabase_project_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

console.log('✅ .env.local 파일 존재 확인');

// 파일 내용 읽기
const envContent = readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

let hasUrl = false;
let hasKey = false;

lines.forEach((line, index) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    hasUrl = true;
    const value = trimmed.split('=')[1];
    if (value && value.trim() !== '') {
      console.log(`✅ VITE_SUPABASE_URL 설정됨: ${value.substring(0, 30)}...`);
    } else {
      console.error(`❌ VITE_SUPABASE_URL 값이 비어있습니다 (라인 ${index + 1})`);
    }
  }
  if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    hasKey = true;
    const value = trimmed.split('=')[1];
    if (value && value.trim() !== '') {
      console.log(`✅ VITE_SUPABASE_ANON_KEY 설정됨: ${value.substring(0, 20)}...`);
    } else {
      console.error(`❌ VITE_SUPABASE_ANON_KEY 값이 비어있습니다 (라인 ${index + 1})`);
    }
  }
});

console.log('');

if (!hasUrl) {
  console.error('❌ VITE_SUPABASE_URL이 .env.local에 없습니다.');
}
if (!hasKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY가 .env.local에 없습니다.');
}

if (hasUrl && hasKey) {
  console.log('✅ 모든 환경 변수가 설정되어 있습니다.');
  console.log('\n💡 환경 변수를 변경했다면 개발 서버를 재시작하세요:');
  console.log('   1. 개발 서버 중지 (Ctrl+C)');
  console.log('   2. npm run dev 다시 실행');
} else {
  console.log('\n💡 .env.local 파일에 다음을 추가하세요:');
  console.log('   VITE_SUPABASE_URL=your_supabase_project_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}
