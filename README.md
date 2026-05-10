# MALO Admin - 키오스크 관리자 시스템

MALO 키오스크 관리 시스템의 프론트엔드 및 백엔드 저장소입니다.

## 프로젝트 구조

```
MaloAdmin/
├── MaloAdmin_frontend/  # React + Vite 프론트엔드
├── MaloAdmin_backend/   # 백엔드 서버
└── README.md
```

## 프론트엔드 (MaloAdmin_frontend)

### 기술 스택

- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구
- **React Router DOM 7** - 라우팅
- **CSS** - 스타일링

### 설치 및 실행

```bash
# 프론트엔드 디렉토리로 이동
cd MaloAdmin_frontend

# 의존성 설치
npm install

# 개발 서버 실행 (기본: http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 파일 수정
# VITE_API_URL=http://localhost:5000/api
```

### 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 로그인 페이지 (기본) |
| `/login` | 로그인 페이지 |
| `/signup` | 회원가입 페이지 |
| `/first` | 첫화면 관리 (배너 관리) |
| `/menu` | 메뉴 관리 |
| `/option` | 옵션 관리 |

### 주요 기능

- **로그인/회원가입**: 관리자 인증
- **첫화면 관리**: 키오스크 첫화면 배너 관리
- **메뉴 관리**: 음료/음식 메뉴 CRUD
- **옵션 관리**: 메뉴 옵션 추가/관리
- **실시간 미리보기**: 키오스크에 표시될 내용 실시간 확인

## 백엔드 (Supabase)

백엔드는 **Supabase**를 사용하여 별도 서버 없이 운영됩니다.

**Supabase 대시보드**: https://supabase.com/dashboard

### Supabase 구성

#### 1. 데이터베이스 테이블

- **profiles** - 사용자 프로필
- **menu_items** - 메뉴 항목
- **banners** - 첫화면 배너
- **options** - 메뉴 옵션

#### 2. 인증 (Auth)
- Supabase Auth 사용
- 이메일/패스워드 로그인

#### 3. 파일 스토리지 (Storage)
- 배너 이미지 저장소: `banners` 버킷

### Supabase 설정 방법

1. [Supabase](https://supabase.com) 회원가입
2. 새 프로젝트 생성
3. 프로젝트 설정에서 API 키 복사:
   - Project URL
   - Anon Public Key
4. `.env` 파일에 설정:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### SQL 스크립트 (Supabase SQL 에디터에서 실행)

```sql
-- Profiles 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items 테이블
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners 테이블
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER,
  image_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API 연동

프론트엔드에서는 `src/utils/api.js`에 정의된 Supabase 함수들을 사용합니다.

### 사용 예시

```javascript
import { loginUser, getMenuItems, uploadBanner } from './utils/api';

// 로그인
const result = await loginUser('admin@example.com', 'password123');
if (result.success) {
  console.log('로그인 성공:', result.data);
}

// 메뉴 조회
const menuResult = await getMenuItems();
if (menuResult.success) {
  console.log('메뉴:', menuResult.data);
}

// 배너 업로드
const bannerResult = await uploadBanner(file, 1);
if (bannerResult.success) {
  console.log('배너 업로드 성공:', bannerResult.data);
}
```

## 개발 가이드

### 컴포넌트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── utils/         # 유틸리티 함수 (API 호출 등)
├── assets/        # 정적 자산
├── App.jsx        # 라우팅 설정
├── main.jsx       # 엔트리 포인트
└── index.css      # 전역 스타일
```

### 스타일링

각 페이지의 CSS 파일은 `src/pages/css/` 디렉토리에 위치합니다.

## Git 저장소

### 저장소 정보

- **프론트엔드**: [현재 저장소]
- **백엔드**: [MALO-kiosk_admin_back](https://github.com/hyeonseo8822/MALO-kiosk_admin_back)

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
perf: 성능 개선
test: 테스트 추가
```

### 배포

프로덕션 배포 시:

```bash
# 환경 변수 설정 (프로덕션)
# VITE_API_URL=https://api.malo.example.com

# 빌드
npm run build

# dist 폴더의 파일들을 웹 서버에 배포
```

## 라이선스

프로젝트의 라이선스 정보는 LICENSE 파일을 참조해주세요.

## 문의

문제나 개선 사항이 있으시면 이슈를 등록해주세요.
