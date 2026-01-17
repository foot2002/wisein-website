// localStorage에서 실제 데이터를 읽어서 Supabase로 마이그레이션
// 브라우저 콘솔에서 실행하거나, Node.js 환경에서 localStorage 데이터를 JSON으로 export한 후 실행

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                           process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// localStorage 데이터를 JSON 파일로 export하는 함수 (브라우저에서 실행)
const exportLocalStorageScript = `
// 브라우저 콘솔에서 실행하세요
const data = {
  inquiries: JSON.parse(localStorage.getItem('admin_inquiries') || '[]'),
  newsletter: JSON.parse(localStorage.getItem('admin_newsletter') || '[]'),
};

console.log(JSON.stringify(data, null, 2));
// 결과를 복사해서 localStorage-data.json 파일에 저장하세요
`;

console.log('📋 브라우저에서 localStorage 데이터를 export하려면:');
console.log('1. 브라우저 콘솔을 열고 다음 코드를 실행하세요:');
console.log(exportLocalStorageScript);
console.log('\n2. 결과를 복사해서 localStorage-data.json 파일에 저장하세요.\n');

// localStorage-data.json 파일이 있으면 읽어서 마이그레이션
const dataFilePath = join(__dirname, '..', 'localStorage-data.json');

try {
  const fileContent = readFileSync(dataFilePath, 'utf-8');
  const localData = JSON.parse(fileContent);

  console.log('📦 localStorage 데이터를 찾았습니다.');
  console.log(`   문의글: ${localData.inquiries?.length || 0}건`);
  console.log(`   뉴스레터 구독자: ${localData.newsletter?.length || 0}건\n`);

  async function migrateData() {
    const results = {
      inquiries: { success: 0, failed: 0 },
      newsletter: { success: 0, failed: 0 },
    };

    // Inquiries 마이그레이션
    if (localData.inquiries && localData.inquiries.length > 0) {
      console.log('📧 문의글 데이터 마이그레이션 중...\n');
      for (const inquiry of localData.inquiries) {
        try {
          const { error } = await supabase
            .from('inquiries')
            .upsert({
              id: inquiry.id,
              name: inquiry.name,
              email: inquiry.email,
              company: inquiry.company,
              phone: inquiry.phone,
              type: inquiry.type,
              message: inquiry.message,
              reply: inquiry.reply || null,
              replied_at: inquiry.repliedAt || null,
              created_at: inquiry.createdAt,
              status: inquiry.status || 'pending',
            }, { onConflict: 'id' });
          
          if (error) throw error;
          console.log(`✅ Inquiry ${inquiry.id}: ${inquiry.name} - ${inquiry.type}`);
          results.inquiries.success++;
        } catch (error) {
          console.error(`❌ Inquiry ${inquiry.id} 실패:`, error.message);
          results.inquiries.failed++;
        }
      }
    }

    // Newsletter Subscribers 마이그레이션
    if (localData.newsletter && localData.newsletter.length > 0) {
      console.log('\n📬 뉴스레터 구독자 데이터 마이그레이션 중...\n');
      for (const subscriber of localData.newsletter) {
        try {
          const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert({
              id: subscriber.id,
              email: subscriber.email,
              created_at: subscriber.createdAt,
            }, { onConflict: 'id' });
          
          if (error) throw error;
          console.log(`✅ Subscriber ${subscriber.id}: ${subscriber.email}`);
          results.newsletter.success++;
        } catch (error) {
          console.error(`❌ Subscriber ${subscriber.id} 실패:`, error.message);
          results.newsletter.failed++;
        }
      }
    }

    console.log('\n📊 마이그레이션 결과:');
    console.log(`   문의글: 성공 ${results.inquiries.success}, 실패 ${results.inquiries.failed}`);
    console.log(`   뉴스레터 구독자: 성공 ${results.newsletter.success}, 실패 ${results.newsletter.failed}`);
    console.log('\n✅ 마이그레이션 완료!\n');
  }

  migrateData();
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('⚠️  localStorage-data.json 파일을 찾을 수 없습니다.');
    console.log('\n📝 다음 단계를 따라주세요:');
    console.log('1. 브라우저에서 개발자 도구(F12)를 엽니다');
    console.log('2. Console 탭에서 다음 코드를 실행합니다:');
    console.log('\n' + exportLocalStorageScript);
    console.log('\n3. 출력된 JSON을 복사해서 localStorage-data.json 파일에 저장합니다');
    console.log('4. 다시 이 스크립트를 실행합니다\n');
  } else {
    console.error('❌ 오류:', error.message);
  }
}
