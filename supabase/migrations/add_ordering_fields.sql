-- Add ordering fields to all content tables
-- Run this migration in Supabase SQL Editor

-- Portfolio: Add published_at and sort_order
ALTER TABLE portfolio 
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Blog: Add published_at and sort_order
ALTER TABLE blog 
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Announcements: Add published_at and sort_order
ALTER TABLE announcements 
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Press Releases: Add published_at and sort_order
ALTER TABLE press_releases 
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Set published_at to created_at for existing rows (if published_at is NULL)
UPDATE portfolio SET published_at = created_at WHERE published_at IS NULL;
UPDATE blog SET published_at = created_at WHERE published_at IS NULL;
UPDATE announcements SET published_at = created_at WHERE published_at IS NULL;
UPDATE press_releases SET published_at = created_at WHERE published_at IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_ordering ON portfolio(sort_order, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_ordering ON blog(sort_order, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_ordering ON announcements(sort_order, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_releases_ordering ON press_releases(sort_order, published_at DESC);
