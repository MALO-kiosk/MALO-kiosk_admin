import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const toUnitPriceWon = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatPriceLabel = (value) => `${toUnitPriceWon(value).toLocaleString('ko-KR')}원`;

const normalizeMenuItem = (item) => {
  const unitPriceWon = toUnitPriceWon(item?.unit_price_won ?? item?.price);
  return {
    ...item,
    unit_price_won: unitPriceWon,
    price: formatPriceLabel(unitPriceWon),
  };
};

const supabaseAuthOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseAuthOptions);
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : supabase;

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
    
    // 사용자 정보 저장
    if (data.user) {
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{ id: data.user.id, name, email }])
        .select();
      
      if (insertError) throw insertError;
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
    return { success: true, data: Array.isArray(data) ? data.map(normalizeMenuItem) : data };
  } catch (error) {
    console.error('Menu Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 추가
export const addMenuItem = async (menuData) => {
  try {
    const unitPriceWon = toUnitPriceWon(menuData?.unit_price_won ?? menuData?.price);
    const payload = {
      ...menuData,
      unit_price_won: unitPriceWon,
    };
    delete payload.price;

    const { data, error } = await supabase
      .from('menu_items')
      .insert([payload])
      .select();
    if (error) throw error;
    return { success: true, data: Array.isArray(data) ? data.map(normalizeMenuItem) : data };
  } catch (error) {
    console.error('Menu Add Error:', error);
    return { success: false, error: error.message };
  }
};

// 메뉴 수정
export const updateMenuItem = async (id, menuData) => {
  try {
    const unitPriceWon = toUnitPriceWon(menuData?.unit_price_won ?? menuData?.price);
    const payload = {
      ...menuData,
      unit_price_won: unitPriceWon,
    };
    delete payload.price;

    const { data, error } = await supabase
      .from('menu_items')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data: Array.isArray(data) ? data.map(normalizeMenuItem) : data };
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

// 커스텀 옵션 그룹 및 아이템 조회 (그룹-아이템 관계 포함)
export const getCustomOptions = async () => {
  try {
    const { data, error } = await supabase
      .from('option_groups')
      .select('*, option_items(*)')
      .order('id', { ascending: true });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Custom Options Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// 그룹 이름으로 그룹 조회
export const getOptionGroupByName = async (name) => {
  try {
    const { data, error } = await supabase
      .from('option_groups')
      .select('*')
      .eq('name', name)
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // single() returns 406 if no rows
    return { success: true, data };
  } catch (error) {
    console.error('Get Option Group Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 그룹 추가
export const addOptionGroup = async (group) => {
  try {
    const { data, error } = await supabase
      .from('option_groups')
      .insert([group])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Group Add Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 아이템 추가
export const addOptionItem = async (item) => {
  try {
    const { data, error } = await supabase
      .from('option_items')
      .insert([item])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Item Add Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 아이템 수정
export const updateOptionItem = async (id, item) => {
  try {
    const { data, error } = await supabase
      .from('option_items')
      .update(item)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Item Update Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 아이템 삭제
export const deleteOptionItem = async (id) => {
  try {
    const { error } = await supabase
      .from('option_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Option Item Delete Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 그룹 삭제
export const deleteOptionGroup = async (id) => {
  try {
    const { error } = await supabase
      .from('option_groups')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Option Group Delete Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 그룹 수정
export const updateOptionGroup = async (id, group) => {
  try {
    const { data, error } = await supabase
      .from('option_groups')
      .update(group)
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Option Group Update Error:', error);
    return { success: false, error: error.message };
  }
};

// 배너 업로드
export const uploadBanner = async (file, position) => {
  try {
    // 파일명 정제: 한글, 특수문자 제거 (영문, 숫자, -, _만 허용)
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    let namePart = file.name.substring(0, file.name.lastIndexOf('.'));
    namePart = namePart.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const fileName = `${Date.now()}_${namePart || 'file'}${ext}`.toLowerCase();
    
    console.log('[Banner Upload Debug]');
    console.log('Original filename:', file.name);
    console.log('Cleaned filename:', fileName);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    console.log('Position:', position);
    
    // 파일 업로드
    console.log('Starting Storage upload...');
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('banners')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error('Storage Upload Error Details:', uploadError);
      throw uploadError;
    }
    console.log('Storage upload success:', uploadData);
    
    // 공개 URL 획득
    const { data: publicUrlData } = supabase.storage
      .from('banners')
      .getPublicUrl(fileName);
    console.log('Public URL:', publicUrlData.publicUrl);
    
    // DB에 기록 (UPSERT: position 기준으로 update or insert)
    console.log('Starting DB upsert...');
    const { data, error } = await supabase
      .from('banners')
      .upsert([{ position, image_url: publicUrlData.publicUrl, file_name: fileName }], { 
        onConflict: 'position' 
      })
      .select();
    
    if (error) {
      console.error('DB Upsert Error Details:', error);
      throw error;
    }
    console.log('DB upsert success:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Banner Upload Error:', error);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error details:', error);
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
  getCustomOptions,
  getOptionGroupByName,
  addOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  addOptionItem,
  updateOptionItem,
  deleteOptionItem,
};
