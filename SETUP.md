# MALO Admin - 프로젝트 설정 가이드

## 🎯 프로젝트 개요

MALO 키오스크 관리자 시스템으로, 프론트엔드와 백엔드로 구성됩니다.

- **프론트엔드**: React + Vite (현재 저장소)
- **백엔드**: Node.js/Express (별도 저장소)

## 📁 저장소 정보

### 프론트엔드
- **GitHub**: https://github.com/hyeonseo8822/MALO-kiosk_admin_front
- **위치**: `MaloAdmin_frontend/`
- **기술**: React 19, Vite, React Router v7

### 백엔드
- **GitHub**: https://github.com/hyeonseo8822/MALO-kiosk_admin_back
- **위치**: `MaloAdmin_backend/`
- **기술**: Node.js, Express (예상)

## 🚀 빠른 시작

### 프론트엔드 실행

```bash
cd MaloAdmin_frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 백엔드 연동 설정

`.env` 파일을 생성하여 백엔드 URL 설정:

```bash
cp .env.example .env
```

`.env` 파일 수정:
```
VITE_API_URL=http://localhost:5000/api
```

> 백엔드가 5000번 포트에서 실행된다고 가정

## 📋 페이지 목록

| URL | 페이지 | 설명 |
|-----|--------|------|
| `/` | LoginPage | 로그인 (기본 페이지) |
| `/login` | LoginPage | 로그인 |
| `/signup` | SignUpPage | 회원가입 |
| `/first` | FirstPage | 첫화면 배너 관리 |
| `/menu` | MenuPage | 메뉴 CRUD 관리 |
| `/option` | OptionPage | 옵션 CRUD 관리 |

## 🔧 개발 중 필요한 작업

### 1. 로그인 통합
- [ ] 백엔드 login API와 연동
- [ ] JWT 토큰 저장소 설정
- [ ] 인증 상태 관리 (Context/Redux)
- [ ] 토큰 만료 처리

### 2. 데이터 관리
- [ ] 메뉴 데이터 API 연동
- [ ] 옵션 데이터 API 연동
- [ ] 배너 이미지 업로드 API 연동
- [ ] 상태 관리 (Context 또는 상태 관리 라이브러리)

### 3. 페이지 기능 완성
- [ ] LoginPage: 실제 인증 로직
- [ ] SignUpPage: 회원가입 API 호출
- [ ] FirstPage: 배너 이미지 업로드/관리
- [ ] MenuPage: 메뉴 CRUD 완성
- [ ] OptionPage: 옵션 CRUD 완성

### 4. UI/UX 개선
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 처리
- [ ] 성공 메시지 표시
- [ ] 반응형 디자인 검증

### 5. 배포 준비
- [ ] 환경 변수 설정 (프로덕션)
- [ ] 빌드 및 테스트
- [ ] CI/CD 파이프라인 구성
- [ ] 배포 서버 설정

## 🔌 API 연동 시작하기

`src/utils/api.js` 파일에 이미 정의된 함수들을 사용합니다:

```javascript
import { loginUser, getMenuItems } from './utils/api';

// 예: 로그인
const handleLogin = async () => {
  const result = await loginUser(email, password);
  if (result.success) {
    // 로그인 성공 처리
  } else {
    // 에러 처리
  }
};

// 예: 메뉴 조회
const handleGetMenus = async () => {
  const result = await getMenuItems();
  if (result.success) {
    setMenus(result.data);
  }
};
```

## 📝 커밋 컨벤션

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷
refactor: 코드 리팩토링
perf: 성능 개선
test: 테스트 추가
chore: 빌드/설정 변경
```

## 🐛 문제 해결

### 포트 충돌
개발 서버가 5173 포트를 사용합니다. 이미 사용 중이면:
```bash
npm run dev -- --port 3000
```

### API 연결 오류
- 백엔드가 실행 중인지 확인
- `.env` 파일의 `VITE_API_URL` 확인
- 브라우저 Console 확인 (F12)
- 네트워크 탭에서 API 요청 상태 확인

### node_modules 문제
```bash
rm -rf node_modules
npm install
```

## 📚 추가 리소스

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [React Router 공식 문서](https://reactrouter.com/)

## 💬 연락처

프로젝트 관련 문의나 이슈는 GitHub Issues를 통해 등록해주세요.
