# 🚀 Supabase 설정 가이드

프로젝트에 Supabase를 설정하는 단계별 가이드입니다.

## 1단계: SQL 테이블 생성

### Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `miniocoobzdvixdbvrgq`
3. 좌측 메뉴 > **SQL Editor** 클릭

### SQL 스크립트 실행
1. **SQL Editor** 페이지에서 **"New Query"** 클릭
2. `SUPABASE_SETUP.sql` 파일의 전체 내용 복사
3. 에디터에 붙여넣기
4. **"Run"** 버튼 클릭

결과:
- ✅ profiles 테이블
- ✅ menu_items 테이블  
- ✅ banners 테이블
- ✅ options 테이블
- ✅ RLS 정책 적용

## 2단계: Storage 버킷 생성

### 배너 이미지 저장소 생성
1. 좌측 메뉴 > **Storage** 클릭
2. **"New bucket"** 클릭
3. 버킷 이름: `banners` 입력
4. **"Create bucket"** 클릭

### 접근 권한 설정
1. **banners** 버킷 클릭
2. 우측 메뉴 > **Policies** 클릭
3. **"New policy"** 클릭
4. 다음 정책 추가:

#### 정책 1: 파일 업로드
```
FOR INSERT
TO authenticated
WITH CHECK (true)
```

#### 정책 2: 파일 조회
```
FOR SELECT
TO public
USING (true)
```

#### 정책 3: 파일 삭제
```
FOR DELETE
TO authenticated
USING (true)
```

## 3단계: Authentication 설정

### 이메일/패스워드 활성화
1. 좌측 메뉴 > **Authentication** > **Providers** 클릭
2. **Email** 항목 확인 (기본 활성화)
3. **Confirm email** 설정 (선택사항)

## 4단계: 프로젝트에서 확인

### 환경 변수 확인
`.env` 파일 확인:
```
VITE_SUPABASE_URL=https://miniocoobzdvixdbvrgq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Jer37K2mZhdeZKOom6ZfJw_1olPU5f-
```

### 개발 서버 실행
```bash
cd MaloAdmin_frontend
npm run dev
```

## 5단계: 테스트 데이터 추가 (선택사항)

### 테스트 메뉴 추가
**Supabase SQL Editor**에서 실행:

```sql
INSERT INTO menu_items (name, price) VALUES
  ('아메리카노', '3,000원'),
  ('카페라떼', '3,500원'),
  ('녹차', '3,000원'),
  ('에스프레소', '2,500원');
```

### 테스트 옵션 추가
```sql
INSERT INTO options (name, price) VALUES
  ('샷 추가', '500원'),
  ('시럽 추가', '500원'),
  ('휘핑크림', '1,000원');
```

## 📋 주요 테이블 정보

### profiles (사용자 프로필)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 사용자 ID (auth.users 연결) |
| name | TEXT | 사용자 이름 |
| email | TEXT | 이메일 (유니크) |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

### menu_items (메뉴)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 메뉴 ID |
| name | TEXT | 메뉴명 |
| price | TEXT | 가격 |
| image_url | TEXT | 이미지 URL |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

### banners (배너)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 배너 ID |
| position | INTEGER | 배너 위치 (1, 2, 3...) |
| image_url | TEXT | 이미지 URL |
| file_name | TEXT | 파일명 |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

### options (옵션)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 옵션 ID |
| name | TEXT | 옵션명 |
| price | TEXT | 추가 가격 |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

## 🔗 유용한 링크

- [Supabase 대시보드](https://supabase.com/dashboard)
- [Supabase 문서](https://supabase.com/docs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)

## ❓ 문제 해결

### CORS 오류
Storage 접근 시 CORS 오류가 발생하면:
1. **Project Settings** > **CORS** 
2. Allowed origins에 `http://localhost:5173` 추가 (개발)

### RLS 정책 오류
데이터 접근 불가하면:
1. **SQL Editor** > **Policies** 확인
2. 정책이 올바르게 적용되었는지 확인

### 인증 오류
로그인 안 되면:
1. Authentication > Providers 확인
2. 이메일 주소 정확한지 확인
3. 비밀번호가 최소 6자 이상인지 확인

---

✅ 모든 설정이 완료되면 개발을 시작할 수 있습니다!
