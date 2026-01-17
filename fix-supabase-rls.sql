-- Supabase RLS 정책 재설정 스크립트
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Allow public read access" ON portfolio;
DROP POLICY IF EXISTS "Allow public read access" ON blog;
DROP POLICY IF EXISTS "Allow public read access" ON inquiries;
DROP POLICY IF EXISTS "Allow public read access" ON announcements;
DROP POLICY IF EXISTS "Allow public read access" ON press_releases;
DROP POLICY IF EXISTS "Allow public read access" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Allow public insert access" ON portfolio;
DROP POLICY IF EXISTS "Allow public insert access" ON blog;
DROP POLICY IF EXISTS "Allow public insert access" ON inquiries;
DROP POLICY IF EXISTS "Allow public insert access" ON announcements;
DROP POLICY IF EXISTS "Allow public insert access" ON press_releases;
DROP POLICY IF EXISTS "Allow public insert access" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Allow public update access" ON portfolio;
DROP POLICY IF EXISTS "Allow public update access" ON blog;
DROP POLICY IF EXISTS "Allow public update access" ON inquiries;
DROP POLICY IF EXISTS "Allow public update access" ON announcements;
DROP POLICY IF EXISTS "Allow public update access" ON press_releases;

DROP POLICY IF EXISTS "Allow public delete access" ON portfolio;
DROP POLICY IF EXISTS "Allow public delete access" ON blog;
DROP POLICY IF EXISTS "Allow public delete access" ON inquiries;
DROP POLICY IF EXISTS "Allow public delete access" ON announcements;
DROP POLICY IF EXISTS "Allow public delete access" ON press_releases;
DROP POLICY IF EXISTS "Allow public delete access" ON newsletter_subscribers;

-- RLS 활성화
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (anon key 사용)
CREATE POLICY "Allow public read access" ON portfolio 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access" ON blog 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access" ON inquiries 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access" ON announcements 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access" ON press_releases 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access" ON newsletter_subscribers 
  FOR SELECT 
  USING (true);

-- 모든 사용자가 쓰기 가능 (anon key 사용)
CREATE POLICY "Allow public insert access" ON portfolio 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON blog 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON inquiries 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON announcements 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON press_releases 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON newsletter_subscribers 
  FOR INSERT 
  WITH CHECK (true);

-- 모든 사용자가 수정 가능
CREATE POLICY "Allow public update access" ON portfolio 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public update access" ON blog 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public update access" ON inquiries 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public update access" ON announcements 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public update access" ON press_releases 
  FOR UPDATE 
  USING (true);

-- 모든 사용자가 삭제 가능
CREATE POLICY "Allow public delete access" ON portfolio 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public delete access" ON blog 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public delete access" ON inquiries 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public delete access" ON announcements 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public delete access" ON press_releases 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public delete access" ON newsletter_subscribers 
  FOR DELETE 
  USING (true);
