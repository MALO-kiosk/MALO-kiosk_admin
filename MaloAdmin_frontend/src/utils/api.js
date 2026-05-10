import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 로그인
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: error.message };
  }
};

// 회원가입
export const signupUser = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    // 프로필 정보 저장
    if (data.user) {
      await supabase
        .from('profiles')
        .insert([{ id: data.user.id, name, email }])
        .select();
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Signup Error:', error);
    return { success: false, error: error.message };
  }
};

// 로그아웃
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    return { success: false, error: error.message };
  }
};

// 현재 세션 조회
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Session Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 조회
export const getMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Menu Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 추가
export const addMenuItem = async (menuData) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([menuData])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Menu Add Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 수정
export const updateMenuItem = async (id, menuData) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Menu Update Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 삭제
export const deleteMenuItem = async (id) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Menu Delete Error:', error);
    return { success: false, error: error.message };
  }
};

// 배너 조회
export const getBanners = async () => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Banner Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// 배너 업로드
export const uploadBanner = async (file, position) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    
    // 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('banners')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // 공개 URL 획득
    const { data: publicUrlData } = supabase.storage
      .from('banners')
      .getPublicUrl(fileName);
    
    // DB에 기록
    const { data, error } = await supabase
      .from('banners')
      .insert([{ position, image_url: publicUrlData.publicUrl, file_name: fileName }])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Banner Upload Error:', error);
    return { success: false, error: error.message };
  }
};

// 배너 삭제
export const deleteBanner = async (id, fileName) => {
  try {
    // 스토리지에서 파일 삭제
    await supabase.storage.from('banners').remove([fileName]);
    
    // DB에서 레코드 삭제
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Banner Delete Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 조회
export const getOptions = async () => {
  try {
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 추가
export const addOption = async (optionData) => {
  try {
    const { data, error } = await supabase
      .from('options')
      .insert([optionData])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Add Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 수정
export const updateOption = async (id, optionData) => {
  try {
    const { data, error } = await supabase
      .from('options')
      .update(optionData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Update Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 삭제
export const deleteOption = async (id) => {
  try {
    const { error } = await supabase
      .from('options')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Option Delete Error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  supabase,
  loginUser,
  signupUser,
  logoutUser,
  getCurrentSession,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getBanners,
  uploadBanner,
  deleteBanner,
  getOptions,
  addOption,
  updateOption,
  deleteOption,
};
