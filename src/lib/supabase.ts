import { createClient } from '@supabase/supabase-js';

// Supabase URL과 Anon Key는 환경 변수에서 가져옵니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Falling back to localStorage.');
}

// Supabase 클라이언트 생성
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase 연결 여부 확인
export const isSupabaseEnabled = () => {
  return supabase !== null;
};
