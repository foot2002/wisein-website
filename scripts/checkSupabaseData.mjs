// Supabase DB 데이터 확인 스크립트
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

async function checkData() {
  console.log('🔍 Supabase DB 데이터 확인 중...\n');

  const tables = [
    { name: 'announcements', label: '공지사항' },
    { name: 'blog', label: '블로그' },
    { name: 'portfolio', label: '포트폴리오' },
    { name: 'press_releases', label: '보도자료' },
    { name: 'inquiries', label: '문의글' },
    { name: 'newsletter_subscribers', label: '뉴스레터 구독자' },
  ];

  const results = {};

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact' })
        .limit(5);

      if (error) {
        console.error(`❌ ${table.label} (${table.name}): 오류 -`, error.message);
        results[table.name] = { count: 0, error: error.message };
      } else {
        const count = data?.length || 0;
        console.log(`✅ ${table.label} (${table.name}): ${count}건`);
        if (count > 0) {
          console.log(`   예시 데이터:`);
          data.slice(0, 2).forEach((item, idx) => {
            if (table.name === 'announcements') {
              console.log(`     ${idx + 1}. ${item.title} (${item.category})`);
            } else if (table.name === 'blog') {
              console.log(`     ${idx + 1}. ${item.title} (${item.category})`);
            } else if (table.name === 'portfolio') {
              console.log(`     ${idx + 1}. ${item.title} (${item.client})`);
            } else if (table.name === 'press_releases') {
              console.log(`     ${idx + 1}. ${item.title} (${item.source})`);
            } else if (table.name === 'inquiries') {
              console.log(`     ${idx + 1}. ${item.name} - ${item.type} (${item.status})`);
            } else if (table.name === 'newsletter_subscribers') {
              console.log(`     ${idx + 1}. ${item.email}`);
            }
          });
        }
        results[table.name] = { count, data: data?.slice(0, 2) || [] };
      }
    } catch (error) {
      console.error(`❌ ${table.label} (${table.name}): 예외 발생 -`, error.message);
      results[table.name] = { count: 0, error: error.message };
    }
    console.log('');
  }

  console.log('\n📊 요약:');
  console.log(`   공지사항: ${results.announcements?.count || 0}건`);
  console.log(`   블로그: ${results.blog?.count || 0}건`);
  console.log(`   포트폴리오: ${results.portfolio?.count || 0}건`);
  console.log(`   보도자료: ${results.press_releases?.count || 0}건`);
  console.log(`   문의글: ${results.inquiries?.count || 0}건`);
  console.log(`   뉴스레터 구독자: ${results.newsletter_subscribers?.count || 0}건`);

  // 데이터가 없는 테이블 확인
  const emptyTables = tables.filter(t => (results[t.name]?.count || 0) === 0);
  if (emptyTables.length > 0) {
    console.log('\n⚠️  데이터가 없는 테이블:');
    emptyTables.forEach(t => {
      console.log(`   - ${t.label} (${t.name})`);
    });
    console.log('\n💡 마이그레이션이 필요할 수 있습니다.');
  }
}

checkData();
