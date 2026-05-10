-- MALO Admin 데이터베이스 설정 SQL 스크립트
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요

-- 1. Profiles 테이블 (사용자 프로필)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles 테이블 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Menu Items 테이블 (메뉴 항목)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items 테이블 RLS 활성화
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모두 조회 가능, 관리자만 수정/삭제
CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert menu items" ON menu_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update menu items" ON menu_items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete menu items" ON menu_items
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. Banners 테이블 (첫화면 배너)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Banners 테이블 RLS 활성화
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모두 조회 가능, 관리자만 수정/삭제
CREATE POLICY "Anyone can view banners" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert banners" ON banners
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update banners" ON banners
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete banners" ON banners
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Options 테이블 (메뉴 옵션)
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블 RLS 활성화
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모두 조회 가능, 관리자만 수정/삭제
CREATE POLICY "Anyone can view options" ON options
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert options" ON options
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update options" ON options
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete options" ON options
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 인덱스 생성 (쿼리 성능 향상)
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON menu_items(created_at);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_options_created_at ON options(created_at);
