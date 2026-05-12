-- Alliance Facility Care Solution CMS Database Schema
-- Copy and paste these SQL commands into your Supabase SQL editor

-- 1. SITE SETTINGS TABLE
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT,
  logo_dark_url TEXT,
  company_name TEXT DEFAULT 'Alliance Facility Care Solutions',
  company_email TEXT,
  company_phone TEXT,
  company_address TEXT,
  company_description TEXT,
  operating_hours TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  primary_color TEXT DEFAULT '#10b981',
  secondary_color TEXT DEFAULT '#14b8a6',
  footer_text TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(id)
);

-- 2. PAGES TABLE
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  is_published BOOLEAN DEFAULT true,
  show_in_menu BOOLEAN DEFAULT false,
  menu_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. NAVIGATION MENU TABLE
CREATE TABLE navigation_menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT,
  page_id UUID REFERENCES pages(id),
  parent_id UUID REFERENCES navigation_menu(id),
  menu_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. HERO SECTIONS TABLE
CREATE TABLE hero_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  cta_text_secondary TEXT,
  cta_link_secondary TEXT,
  gradient_overlay BOOLEAN DEFAULT true,
  overlay_opacity NUMERIC DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. HOME PAGE SECTIONS TABLE
CREATE TABLE home_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'hero', 'services', 'why_choose', 'testimonials', 'cta', 'before_after'
  section_title TEXT,
  section_subtitle TEXT,
  content_blocks JSONB,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  section_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_image_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. FAQ TABLE
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. CONTENT BLOCKS TABLE (Reusable sections)
CREATE TABLE content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  block_type TEXT NOT NULL, -- 'text', 'cta', 'image', 'testimonial', 'stats'
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. SERVICES ENHANCEMENTS (Add columns to existing services table if needed)
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_title TEXT;
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_description TEXT;
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS service_order INTEGER DEFAULT 0;

-- 10. REDIRECTS TABLE (For old URL redirects)
CREATE TABLE redirects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  old_url TEXT UNIQUE NOT NULL,
  new_url TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (Optional but recommended)
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE navigation_menu ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);
CREATE INDEX idx_hero_page_slug ON hero_sections(page_slug);
CREATE INDEX idx_home_sections_order ON home_sections(section_order);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_navigation_parent ON navigation_menu(parent_id);

-- Insert default site settings
INSERT INTO site_settings (
  logo_url,
  company_name,
  company_email,
  company_phone,
  company_address,
  operating_hours,
  company_description,
  footer_text
) VALUES (
  'https://media.base44.com/images/public/user_69ed7b6c098081c9ac960a39/bf2ffc47f_Finallogo.png',
  'Alliance Facility Care Solutions LLC',
  'support@alliancefacilitycaresolution.com',
  '+1 314 705 4493',
  '1093 Ferguson Ave St. Louis 63130, Missouri',
  'Mon – Sat: 7:00 AM – 7:00 PM',
  'Setting the standard in professional facility care through precision, reliability, and an unwavering commitment to excellence.',
  '2026 Alliance Facility Care Solutions. All rights reserved.'
);

-- Insert default pages
INSERT INTO pages (slug, title, subtitle, description, is_published, show_in_menu, menu_order) VALUES
  ('home', 'Home', 'Professional Facility Care Solutions', 'The invisible standard of clean', true, true, 1),
  ('about', 'About Us', 'Our Story', 'Learn more about Alliance Facility Care Solutions', true, true, 2),
  ('services', 'Services', 'Our Services', 'Comprehensive cleaning and facility maintenance', true, true, 3),
  ('contact', 'Contact', 'Get in Touch', 'Reach out to our team', true, true, 4),
  ('privacy', 'Privacy Policy', NULL, 'Privacy Policy', true, false, NULL),
  ('terms', 'Terms of Service', NULL, 'Terms of Service', true, false, NULL);

-- Insert default navigation menu
INSERT INTO navigation_menu (label, url, page_id, menu_order, is_active) VALUES
  ('Home', '/', NULL, 1, true),
  ('About', '/about', NULL, 2, true),
  ('Services', '/services', NULL, 3, true),
  ('Contact', '/contact', NULL, 4, true);
