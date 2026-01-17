-- Supabase 테이블 스키마
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- Portfolio 테이블
CREATE TABLE IF NOT EXISTS portfolio (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog 테이블
CREATE TABLE IF NOT EXISTS blog (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries 테이블
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied'))
);

-- Announcements 테이블
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Press Releases 테이블
CREATE TABLE IF NOT EXISTS press_releases (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers 테이블
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
-- 모든 테이블에 대해 읽기/쓰기 모두 허용 (anon key 사용)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Allow public read access" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON blog FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON press_releases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON newsletter_subscribers FOR SELECT USING (true);

-- 모든 사용자가 쓰기 가능 (anon key 사용)
CREATE POLICY "Allow public insert access" ON portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON blog FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON press_releases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 모든 사용자가 수정 가능
CREATE POLICY "Allow public update access" ON portfolio FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON blog FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON inquiries FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON press_releases FOR UPDATE USING (true);

-- 모든 사용자가 삭제 가능
CREATE POLICY "Allow public delete access" ON portfolio FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON blog FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON inquiries FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON announcements FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON press_releases FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON newsletter_subscribers FOR DELETE USING (true);

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON blog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_releases_updated_at BEFORE UPDATE ON press_releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
