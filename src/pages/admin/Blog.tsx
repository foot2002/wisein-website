import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getBlogPosts,
  saveBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPost,
} from "@/lib/adminStorage";
import { Plus, Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const categories = ["전체", "인사이트", "기술", "케이스스터디", "리서치"];

type SortField = "createdAt" | "updatedAt" | "date" | "title";
type SortOrder = "asc" | "desc";

export default function AdminBlog() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPosts();
    // Check if URL has ?new=true parameter
    if (searchParams.get("new") === "true") {
      setEditingPost(null);
      setShowForm(true);
      // Remove the parameter from URL
      window.history.replaceState({}, "", "/admin/blog");
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSort();
  }, [posts, selectedCategory, searchQuery, sortField, sortOrder]);

  const loadPosts = async () => {
    const data = await getBlogPosts();
    setPosts(data);
  };

  const filterAndSort = () => {
    let filtered = [...posts];

    // Category filter
    if (selectedCategory !== "전체") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
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

    setFilteredPosts(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteBlogPost(id);
      loadPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // CRITICAL: Ensure we're in CREATE mode (not EDIT mode)
    const isEditMode = !!editingPost;
    console.log('📝 Form submit mode:', isEditMode ? 'EDIT' : 'CREATE');
    console.log('   editingPost:', editingPost ? { id: editingPost.id, title: editingPost.title } : null);
    
    // Create data object - explicitly exclude id
    const data: Record<string, any> = {
      category: formData.get("category") as string,
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string || undefined,
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      readTime: formData.get("readTime") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
    };
    
    // Handle sort_order
    const sortOrderValue = formData.get("sortOrder");
    if (sortOrderValue !== null && sortOrderValue !== '') {
      const sortOrder = Number(sortOrderValue);
      if (!isNaN(sortOrder)) {
        data.sortOrder = sortOrder;
      }
    }
    
    // Handle published_at
    const publishedAtValue = formData.get("publishedAt");
    if (publishedAtValue !== null && publishedAtValue !== '') {
      // Convert datetime-local to ISO string
      data.publishedAt = new Date(publishedAtValue).toISOString();
    }
    
    // CRITICAL: Verify data object does NOT contain id
    if ('id' in data) {
      console.error('❌ CRITICAL: data object contains id field!', data);
      alert('오류: 데이터 객체에 id 필드가 포함되어 있습니다. 이는 발생하면 안 됩니다.');
      return;
    }
    
    // Explicitly remove id if it somehow exists
    delete (data as any).id;
    delete (data as any).createdAt;
    delete (data as any).updatedAt;
    
    console.log('📤 Form data prepared:', {
      keys: Object.keys(data),
      hasId: 'id' in data,
      isEditMode,
    });

    try {
      if (isEditMode && editingPost) {
        // EDIT mode: Use UPDATE (id is used for WHERE clause, not in payload)
        console.log('✏️ Updating blog post with id:', editingPost.id);
        await updateBlogPost(editingPost.id, data);
        alert('블로그 포스트가 성공적으로 수정되었습니다.');
      } else {
        // CREATE mode: Use INSERT (NO id should be included)
        console.log('➕ Creating new blog post (INSERT - NO id)');
        console.log('   Data being passed to saveBlogPost:', {
          keys: Object.keys(data),
          hasId: 'id' in data,
        });
        await saveBlogPost(data);
        alert('블로그 포스트가 성공적으로 등록되었습니다.');
      }

      setShowForm(false);
      setEditingPost(null);
      loadPosts();
    } catch (error: any) {
      console.error('❌ Failed to save blog post:', error);
      const errorMessage = error?.message || error?.error?.message || '블로그 포스트 저장 중 오류가 발생했습니다.';
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
      const { uploadBlogImage } = await import('@/lib/supabaseStorage');
      const imageUrl = await uploadBlogImage(file);
      
      if (imageUrl) {
        const imageUrlInput = form.querySelector('input[name="imageUrl"]') as HTMLInputElement;
        if (imageUrlInput) {
          imageUrlInput.value = imageUrl;
        }
      } else {
        // Supabase 업로드 실패 시 Base64로 폴백
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          const imageUrlInput = form.querySelector('input[name="imageUrl"]') as HTMLInputElement;
          if (imageUrlInput) {
            imageUrlInput.value = base64Url;
          }
        };
        reader.readAsDataURL(file);
        console.warn('Supabase Storage 업로드 실패. Base64로 저장합니다.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다. Base64로 저장합니다.');
      // Base64로 폴백
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        const imageUrlInput = form.querySelector('input[name="imageUrl"]') as HTMLInputElement;
        if (imageUrlInput) {
          imageUrlInput.value = base64Url;
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">블로그 관리</h1>
            <p className="text-muted-foreground">블로그 포스트를 등록, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Button onClick={() => { setEditingPost(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            새 포스트 작성
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
                  <option key={cat} value={cat}>
                    {cat}
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
                  placeholder="제목, 내용, 작성자 검색..."
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
                  <option value="date">게시일</option>
                  <option value="title">제목</option>
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
                {editingPost ? "블로그 포스트 수정" : "새 블로그 포스트 작성"}
              </h2>
              <form onSubmit={handleFormSubmit} id="blog-form">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      카테고리 *
                    </label>
                    <select
                      name="category"
                      defaultValue={editingPost?.category || ""}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                    >
                      {categories.filter((c) => c !== "전체").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      제목 *
                    </label>
                    <Input
                      name="title"
                      defaultValue={editingPost?.title || ""}
                      required
                      placeholder="2024 데이터 산업 트렌드: AI와 데이터 분석의 융합"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      요약 *
                    </label>
                    <textarea
                      name="excerpt"
                      defaultValue={editingPost?.excerpt || ""}
                      required
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                      placeholder="포스트 요약을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      본문 내용
                    </label>
                    <textarea
                      name="content"
                      defaultValue={editingPost?.content || ""}
                      rows={8}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                      placeholder="포스트 본문 내용을 입력하세요"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        작성자 *
                      </label>
                      <Input
                        name="author"
                        defaultValue={editingPost?.author || ""}
                        required
                        placeholder="김데이터"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        게시일 *
                      </label>
                      <Input
                        name="date"
                        type="text"
                        defaultValue={editingPost?.date || ""}
                        required
                        placeholder="2024.01.15"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      읽기 시간
                    </label>
                    <Input
                      name="readTime"
                      defaultValue={editingPost?.readTime || ""}
                      placeholder="8분"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      이미지 URL
                    </label>
                    <Input
                      name="imageUrl"
                      type="url"
                      defaultValue={editingPost?.imageUrl || ""}
                      placeholder="https://example.com/image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, document.getElementById("blog-form") as HTMLFormElement)}
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
                        defaultValue={editingPost?.sortOrder ?? 0}
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
                        defaultValue={editingPost?.publishedAt ? new Date(editingPost.publishedAt).toISOString().slice(0, 16) : ""}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        비워두면 현재 시간으로 설정됩니다
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="submit" className="flex-1">
                    {editingPost ? "수정" : "등록"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">작성자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">게시일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">등록일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">수정일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4 text-sm text-foreground">{post.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{post.author}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{post.date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(post.createdAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(post.updatedAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                등록된 포스트가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
