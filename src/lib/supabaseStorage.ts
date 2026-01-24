// Supabase Storage 유틸리티
import { supabase, isSupabaseEnabled } from './supabase';

const BUCKET_NAME = 'blog-images'; // 블로그 이미지용 버킷
const PORTFOLIO_BUCKET_NAME = 'portfolio-images'; // 포트폴리오 이미지용 버킷

/**
 * Supabase Storage에 이미지 업로드
 * @param file 업로드할 파일
 * @param bucketName 버킷 이름 (기본값: 'blog-images')
 * @param folderName 폴더 이름 (선택사항)
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName: string = BUCKET_NAME,
  folderName?: string
): Promise<string | null> {
  if (!isSupabaseEnabled() || !supabase) {
    console.warn('Supabase is not enabled. Cannot upload image.');
    return null;
  }

  try {
    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // 업로드 경로 생성 (folderName이 있으면 'folderName/fileName', 없으면 'fileName')
    const uploadPath = folderName ? `${folderName}/${fileName}` : fileName;

    console.log('📤 Uploading image to Supabase:', {
      bucket: bucketName,
      uploadPath,
      fileName,
      folderName,
    });

    // 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uploadPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      // 버킷이 없으면 생성 시도
      if (uploadError.message.includes('Bucket not found')) {
        console.warn(`Bucket '${bucketName}' not found. Creating bucket...`);
        // 버킷 생성은 수동으로 해야 할 수 있음 (권한 문제)
        console.error('Please create the bucket manually in Supabase Dashboard:', bucketName);
        return null;
      }
      console.error('❌ Upload error:', uploadError);
      throw uploadError;
    }

    if (!uploadData) {
      console.error('❌ No upload data returned');
      return null;
    }

    // CRITICAL: Use the exact path returned from upload (data.path)
    // This ensures the upload path and public URL path are identical
    const actualPath = uploadData.path;
    
    console.log('✅ Upload successful:', {
      bucket: bucketName,
      actualPath,
      uploadPath,
      pathsMatch: actualPath === uploadPath,
    });

    // CRITICAL: Generate public URL using the EXACT path from upload
    // DO NOT manually construct URLs - always use getPublicUrl()
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(actualPath);

    if (!urlData || !urlData.publicUrl) {
      console.error('❌ Failed to get public URL');
      return null;
    }

    const publicUrl = urlData.publicUrl;

    console.log('🔗 Public URL generated:', {
      bucket: bucketName,
      path: actualPath,
      publicUrl,
      urlFormat: publicUrl.includes('/storage/v1/object/public/'),
    });

    // Verify the URL can be accessed (optional check)
    // The URL should be: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    if (!publicUrl.includes('/storage/v1/object/public/')) {
      console.warn('⚠️ Public URL format may be incorrect:', publicUrl);
    }

    // CRITICAL: Return ONLY the publicUrl value
    // This is what will be saved to image_url in the database
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading image to Supabase:', error);
    return null;
  }
}

/**
 * 블로그 이미지 업로드
 */
export async function uploadBlogImage(file: File): Promise<string | null> {
  return uploadImageToSupabase(file, BUCKET_NAME, 'blog');
}

/**
 * 포트폴리오 이미지 업로드
 */
export async function uploadPortfolioImage(file: File): Promise<string | null> {
  return uploadImageToSupabase(file, PORTFOLIO_BUCKET_NAME, 'portfolio');
}

/**
 * Supabase Storage에서 이미지 삭제
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucketName: string = BUCKET_NAME
): Promise<boolean> {
  if (!isSupabaseEnabled() || !supabase) {
    return false;
  }

  try {
    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // 'bucket-name/folder/file.jpg' 형식

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
