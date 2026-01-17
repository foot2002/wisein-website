# Supabase Storage 설정 가이드

블로그와 포트폴리오 이미지를 Supabase Storage에 업로드하기 위한 설정 방법입니다.

## 1. Supabase Storage 버킷 생성

Supabase Dashboard에서 다음 버킷들을 생성해야 합니다:

### 블로그 이미지 버킷
1. Supabase Dashboard → Storage 메뉴로 이동
2. "New bucket" 버튼 클릭
3. 버킷 이름: `blog-images`
4. Public bucket: ✅ 체크 (공개 접근 허용)
5. File size limit: 10MB (또는 원하는 크기)
6. Allowed MIME types: `image/*` (또는 특정 타입 지정)
7. "Create bucket" 클릭

### 포트폴리오 이미지 버킷
1. 동일한 방법으로 버킷 생성
2. 버킷 이름: `portfolio-images`
3. Public bucket: ✅ 체크
4. File size limit: 10MB
5. Allowed MIME types: `image/*`
6. "Create bucket" 클릭

## 2. Storage 정책 설정 (RLS)

각 버킷에 대해 다음 정책을 설정해야 합니다:

### 읽기 정책 (Public Access)
```sql
-- blog-images 버킷
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- portfolio-images 버킷
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');
```

### 업로드 정책 (Authenticated Users)
```sql
-- blog-images 버킷
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- portfolio-images 버킷
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  auth.role() = 'authenticated'
);
```

### 삭제 정책 (Authenticated Users)
```sql
-- blog-images 버킷
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- portfolio-images 버킷
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' AND
  auth.role() = 'authenticated'
);
```

**참고:** 현재는 anon key를 사용하고 있으므로, 실제로는 모든 사용자가 업로드할 수 있도록 정책을 설정해야 할 수 있습니다. 프로덕션 환경에서는 인증된 사용자만 업로드할 수 있도록 설정하는 것을 권장합니다.

## 3. 사용 방법

1. 관리자 페이지에서 블로그 또는 포트폴리오 작성/수정
2. "이미지 URL" 필드 아래의 파일 선택 버튼 클릭
3. 이미지 파일 선택 (최대 10MB)
4. 자동으로 Supabase Storage에 업로드되고 URL이 입력됩니다
5. 업로드 실패 시 자동으로 Base64로 폴백됩니다

## 4. 폴더 구조

- `blog-images/blog/` - 블로그 이미지
- `portfolio-images/portfolio/` - 포트폴리오 이미지

각 이미지는 타임스탬프와 랜덤 문자열로 고유한 파일명을 가집니다.

## 5. 문제 해결

### 버킷을 찾을 수 없다는 오류
- Supabase Dashboard에서 버킷이 생성되었는지 확인
- 버킷 이름이 정확한지 확인 (`blog-images`, `portfolio-images`)

### 업로드 권한 오류
- Storage 정책이 올바르게 설정되었는지 확인
- RLS 정책이 활성화되어 있는지 확인

### 이미지가 표시되지 않음
- 버킷이 Public으로 설정되어 있는지 확인
- 이미지 URL이 올바른지 확인
