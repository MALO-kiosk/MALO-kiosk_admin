// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API 요청 함수
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// 로그인
export const loginUser = async (email, password) => {
  return apiCall('/auth/login', 'POST', { email, password });
};

// 회원가입
export const signupUser = async (email, name, password) => {
  return apiCall('/auth/signup', 'POST', { email, name, password });
};

// 메뉴 조회
export const getMenuItems = async () => {
  return apiCall('/menu', 'GET');
};

// 메뉴 추가
export const addMenuItem = async (menuData) => {
  return apiCall('/menu', 'POST', menuData);
};

// 메뉴 수정
export const updateMenuItem = async (id, menuData) => {
  return apiCall(`/menu/${id}`, 'PUT', menuData);
};

// 메뉴 삭제
export const deleteMenuItem = async (id) => {
  return apiCall(`/menu/${id}`, 'DELETE');
};

// 첫화면 배너 조회
export const getBanners = async () => {
  return apiCall('/banners', 'GET');
};

// 첫화면 배너 업로드
export const uploadBanner = async (formData) => {
  const options = {
    method: 'POST',
    body: formData,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/banners/upload`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// 옵션 조회
export const getOptions = async () => {
  return apiCall('/options', 'GET');
};

// 옵션 추가
export const addOption = async (optionData) => {
  return apiCall('/options', 'POST', optionData);
};

// 옵션 수정
export const updateOption = async (id, optionData) => {
  return apiCall(`/options/${id}`, 'PUT', optionData);
};

// 옵션 삭제
export const deleteOption = async (id) => {
  return apiCall(`/options/${id}`, 'DELETE');
};

export default {
  loginUser,
  signupUser,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getBanners,
  uploadBanner,
  getOptions,
  addOption,
  updateOption,
  deleteOption,
};
