import { createClient } from '@supabase/supabase-js';

// Supabase URL과 Anon Key는 환경 변수에서 가져옵니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 디버깅: 환경 변수 확인
if (typeof window !== 'undefined') {
  console.log('[Supabase Debug] Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing',
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found. Falling back to localStorage.');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  console.error('   This means all data will be saved to localStorage only, not Supabase!');
}

// Supabase 클라이언트 생성
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase 연결 여부 확인
export const isSupabaseEnabled = () => {
  const enabled = supabase !== null;
  if (typeof window !== 'undefined' && !enabled) {
    console.warn('⚠️ Supabase is NOT enabled. All data will be saved to localStorage.');
  }
  return enabled;
};
