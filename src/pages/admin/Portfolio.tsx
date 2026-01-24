import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPortfolioItems,
  savePortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type PortfolioItem,
} from "@/lib/adminStorage";
import { Plus, Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const categories = [
  { id: "all", label: "전체" },
  { id: "public", label: "공공기관" },
  { id: "enterprise", label: "기업" },
  { id: "research", label: "연구기관" },
  { id: "manufacturing", label: "제조업" },
];

type SortField = "createdAt" | "updatedAt" | "year" | "client";
type SortOrder = "asc" | "desc";

export default function AdminPortfolio() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  useEffect(() => {
    loadItems();
    // Check if URL has ?new=true parameter
    if (searchParams.get("new") === "true") {
      setEditingItem(null);
      setShowForm(true);
      // Remove the parameter from URL
      window.history.replaceState({}, "", "/admin/portfolio");
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSort();
  }, [items, selectedCategory, searchQuery, sortField, sortOrder]);

  const loadItems = async () => {
    const data = await getPortfolioItems();
    setItems(data);
  };

  const filterAndSort = () => {
    let filtered = [...items];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deletePortfolioItem(id);
      loadItems();
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setUploadedImageUrl(item.imageUrl || "");
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent submission if image is currently uploading
    if (uploadingImage) {
      alert('이미지 업로드가 진행 중입니다. 완료될 때까지 기다려주세요.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // STEP 1: Check if there's a file selected but not yet uploaded
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    let finalImageUrl = uploadedImageUrl || (formData.get("imageUrl") as string)?.trim() || editingItem?.imageUrl || "";
    
    // If file is selected but not uploaded yet, upload it FIRST
    if (fileInput?.files?.[0] && !finalImageUrl) {
      const file = fileInput.files[0];
      
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }

      setUploadingImage(true);
      try {
        const { uploadPortfolioImage } = await import('@/lib/supabaseStorage');
        const uploadedUrl = await uploadPortfolioImage(file);
        
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          setUploadedImageUrl(uploadedUrl);
          // Update the input field
          const imageUrlInput = form.querySelector('input[name="imageUrl"]') as HTMLInputElement;
          if (imageUrlInput) {
            imageUrlInput.value = uploadedUrl;
          }
          console.log('✅ Image uploaded before form submission:', uploadedUrl);
        } else {
          const errorMessage = '이미지 업로드에 실패했습니다. Supabase Storage에 연결할 수 없습니다.';
          console.error('❌', errorMessage);
          alert(`오류: ${errorMessage}\n\n포트폴리오 항목은 저장되지 않았습니다.`);
          setUploadingImage(false);
          return;
        }
      } catch (error: any) {
        console.error('❌ Image upload error during form submission:', error);
        const errorMessage = error?.message || '이미지 업로드 중 오류가 발생했습니다.';
        alert(`오류: ${errorMessage}\n\n포트폴리오 항목은 저장되지 않았습니다.`);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }
    
    // STEP 2: Build data object with image URL
    // CRITICAL: Ensure data object does NOT contain id
    const data: Record<string, any> = {
      category: formData.get("category") as string,
      client: formData.get("client") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      year: formData.get("year") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    };

    // CRITICAL: Include imageUrl in payload if available
    if (finalImageUrl && finalImageUrl.length > 0) {
      data.imageUrl = finalImageUrl.trim();
      console.log('📸 Image URL included in save payload:', finalImageUrl.substring(0, 50) + '...');
    } else {
      console.warn('⚠️ No image URL - image_url will be NULL in DB');
    }

    // Explicitly remove id if it somehow exists
    delete (data as any).id;
    delete (data as any).createdAt;
    delete (data as any).updatedAt;
    
    console.log('📤 Portfolio data to save:', { 
      ...data, 
      imageUrl: data.imageUrl ? 'present (' + data.imageUrl.substring(0, 50) + '...)' : 'missing' 
    });

    // STEP 3: Save to database
    try {
      if (editingItem) {
        await updatePortfolioItem(editingItem.id, data);
        alert('포트폴리오 항목이 성공적으로 수정되었습니다.');
      } else {
        await savePortfolioItem(data);
        alert('포트폴리오 항목이 성공적으로 등록되었습니다.');
      }

      setShowForm(false);
      setEditingItem(null);
      setUploadedImageUrl(""); // Reset uploaded image URL
      loadItems(); // Re-fetch from Supabase
    } catch (error: any) {
      console.error('❌ Failed to save portfolio item:', error);
      const errorMessage = error?.message || error?.error?.message || '포트폴리오 항목 저장 중 오류가 발생했습니다.';
      alert(`오류: ${errorMessage}\n\nSupabase DB에 저장되지 않았습니다.`);
      // Do NOT close the form on error - let user retry
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, form: HTMLFormElement) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB 이하여야 합니다.');
      return;
    }

    setUploadingImage(true);
    try {
      const { uploadPortfolioImage } = await import('@/lib/supabaseStorage');
      const imageUrl = await uploadPortfolioImage(file);
      
      if (imageUrl) {
        // Update both state and form input
        setUploadedImageUrl(imageUrl);
        const imageUrlInput = form.querySelector('input[name="imageUrl"]') as HTMLInputElement;
        if (imageUrlInput) {
          imageUrlInput.value = imageUrl;
        }
        console.log('✅ Image uploaded successfully, URL set:', imageUrl);
      } else {
        // Supabase 업로드 실패 - 에러 표시
        setUploadedImageUrl("");
        const errorMessage = '이미지 업로드에 실패했습니다. Supabase Storage에 연결할 수 없습니다.';
        console.error('❌', errorMessage);
        alert(`오류: ${errorMessage}\n\n이미지를 다시 선택해주세요.`);
      }
    } catch (error: any) {
      console.error('❌ Image upload error:', error);
      setUploadedImageUrl("");
      const errorMessage = error?.message || '이미지 업로드 중 오류가 발생했습니다.';
      alert(`오류: ${errorMessage}\n\nSupabase Storage에 저장되지 않았습니다.`);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">포트폴리오 관리</h1>
            <p className="text-muted-foreground">프로젝트 사례를 등록, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setUploadedImageUrl(""); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            새 항목 등록
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">카테고리</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="제목, 클라이언트, 설명 검색..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">정렬</label>
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="createdAt">등록일</option>
                  <option value="updatedAt">수정일</option>
                  <option value="year">연도</option>
                  <option value="client">클라이언트</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {editingItem ? "포트폴리오 수정" : "새 포트폴리오 등록"}
              </h2>
              <form onSubmit={handleFormSubmit} id="portfolio-form" name="portfolio-form">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      카테고리 *
                    </label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || ""}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                    >
                      {categories.filter((c) => c.id !== "all").map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      클라이언트 *
                    </label>
                    <Input
                      name="client"
                      defaultValue={editingItem?.client || ""}
                      required
                      placeholder="과학기술정보통신부"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      제목 *
                    </label>
                    <Input
                      name="title"
                      defaultValue={editingItem?.title || ""}
                      required
                      placeholder="AI 기술 동향 빅데이터 분석 시스템 구축"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      설명 *
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingItem?.description || ""}
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                      placeholder="프로젝트 설명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      연도 *
                    </label>
                    <Input
                      name="year"
                      type="text"
                      defaultValue={editingItem?.year || ""}
                      required
                      placeholder="2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      태그 (쉼표로 구분)
                    </label>
                    <Input
                      name="tags"
                      defaultValue={editingItem?.tags.join(", ") || ""}
                      placeholder="빅데이터, AI, 정책분석"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      이미지 URL
                    </label>
                    <Input
                      name="imageUrl"
                      type="url"
                      value={uploadedImageUrl || editingItem?.imageUrl || ""}
                      onChange={(e) => setUploadedImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, document.getElementById("portfolio-form") as HTMLFormElement)}
                      disabled={uploadingImage}
                      className="mt-2 text-sm"
                    />
                    {uploadingImage && (
                      <p className="text-xs text-accent mt-1">이미지 업로드 중...</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      이미지를 선택하면 Supabase Storage에 업로드됩니다. (최대 10MB)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        정렬 순서 (낮을수록 먼저 표시)
                      </label>
                      <Input
                        name="sortOrder"
                        type="number"
                        defaultValue={editingItem?.sortOrder ?? 0}
                        placeholder="0"
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        기본값: 0 (자동 정렬, 최신순)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        발행일시
                      </label>
                      <Input
                        name="publishedAt"
                        type="datetime-local"
                        defaultValue={editingItem?.publishedAt ? new Date(editingItem.publishedAt).toISOString().slice(0, 16) : ""}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        비워두면 현재 시간으로 설정됩니다
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="submit" className="flex-1" disabled={uploadingImage}>
                    {uploadingImage ? "이미지 업로드 중..." : (editingItem ? "수정" : "등록")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setUploadedImageUrl("");
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">클라이언트</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">연도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">등록일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">수정일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4 text-sm text-foreground">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {categories.find((c) => c.id === item.category)?.label || item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.client}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.year}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(item.updatedAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                등록된 항목이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
