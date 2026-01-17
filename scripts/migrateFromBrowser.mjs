// 브라우저에서 직접 실행할 수 있는 마이그레이션 스크립트
// 이 파일의 내용을 브라우저 콘솔에 붙여넣어 실행하세요

// 먼저 Supabase 클라이언트를 로드해야 합니다
// 이 스크립트는 admin 페이지에서 실행해야 합니다

async function migrateLocalStorageToSupabase() {
  console.log('🚀 localStorage 데이터를 Supabase로 마이그레이션 시작...\n');

  // localStorage에서 데이터 읽기
  const inquiriesData = localStorage.getItem('admin_inquiries');
  const newsletterData = localStorage.getItem('admin_newsletter');

  const inquiries = inquiriesData ? JSON.parse(inquiriesData) : [];
  const newsletter = newsletterData ? JSON.parse(newsletterData) : [];

  console.log(`📦 발견된 데이터:`);
  console.log(`   문의글: ${inquiries.length}건`);
  console.log(`   뉴스레터 구독자: ${newsletter.length}건\n`);

  if (inquiries.length === 0 && newsletter.length === 0) {
    console.log('⚠️  마이그레이션할 데이터가 없습니다.');
    return;
  }

  // Supabase 클라이언트 가져오기 (adminStorage에서)
  const { supabase, isSupabaseEnabled } = await import('/src/lib/supabase.ts');

  if (!isSupabaseEnabled() || !supabase) {
    console.error('❌ Supabase가 활성화되지 않았습니다.');
    return;
  }

  const results = {
    inquiries: { success: 0, failed: 0 },
    newsletter: { success: 0, failed: 0 },
  };

  // Inquiries 마이그레이션
  if (inquiries.length > 0) {
    console.log('📧 문의글 데이터 마이그레이션 중...\n');
    for (const inquiry of inquiries) {
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
  if (newsletter.length > 0) {
    console.log('\n📬 뉴스레터 구독자 데이터 마이그레이션 중...\n');
    for (const subscriber of newsletter) {
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
  console.log('\n✅ 마이그레이션 완료!');
  console.log('💡 페이지를 새로고침하면 Supabase에서 데이터를 불러옵니다.\n');
}

// 실행
migrateLocalStorageToSupabase();
