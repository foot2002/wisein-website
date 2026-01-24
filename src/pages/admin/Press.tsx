import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPressReleases,
  savePressRelease,
  updatePressRelease,
  deletePressRelease,
  type PressRelease,
} from "@/lib/adminStorage";
import { Trash2, ArrowUpDown, Search, Edit, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SortField = "createdAt" | "date" | "source" | "title";
type SortOrder = "asc" | "desc";

export default function AdminPress() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [filteredPressReleases, setFilteredPressReleases] = useState<PressRelease[]>([]);
  const [selectedSource, setSelectedSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingPress, setEditingPress] = useState<PressRelease | null>(null);

  useEffect(() => {
    loadPressReleases();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [pressReleases, selectedSource, searchQuery, sortField, sortOrder]);

  const loadPressReleases = async () => {
    const data = await getPressReleases();
    setPressReleases(data);
  };

  const filterAndSort = () => {
    let filtered = [...pressReleases];

    // Source filter
    if (selectedSource !== "all") {
      filtered = filtered.filter((p) => p.source === selectedSource);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.source.toLowerCase().includes(query) ||
          p.url.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt" || sortField === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPressReleases(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deletePressRelease(id);
      loadPressReleases();
    }
  };

  const handleEdit = (press: PressRelease) => {
    setEditingPress(press);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // CRITICAL: Ensure data object does NOT contain id
    // Only include fields that have values (empty strings are treated as undefined)
    const data: Record<string, any> = {
      title: formData.get("title") as string,
    };

    // Optional fields: only include if they have values
    const date = (formData.get("date") as string)?.trim();
    const source = (formData.get("source") as string)?.trim();
    const url = (formData.get("url") as string)?.trim();
    
    if (date) data.date = date;
    if (source) data.source = source;
    if (url) data.url = url;
    
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

    // Explicitly remove id if it somehow exists
    delete (data as any).id;
    delete (data as any).createdAt;
    delete (data as any).updatedAt;

    try {
      if (editingPress) {
        await updatePressRelease(editingPress.id, data);
        console.log('✅ Press release updated successfully');
        alert('보도자료가 성공적으로 수정되었습니다.');
      } else {
        const savedPress = await savePressRelease(data);
        console.log('✅ Press release saved successfully:', savedPress.id);
        alert('보도자료가 성공적으로 등록되었습니다.');
      }

      // CRITICAL: Close form and reset state
      setShowForm(false);
      setEditingPress(null);
      
      // CRITICAL: Re-fetch from Supabase to sync state
      console.log('🔄 Re-fetching press releases from Supabase...');
      await loadPressReleases();
      console.log('✅ Press releases re-fetched from Supabase');
    } catch (error: any) {
      // CRITICAL: Show explicit error and abort save
      console.error('❌ Failed to save press release:', error);
      const errorMessage = error?.message || error?.error?.message || '보도자료 저장 중 오류가 발생했습니다.';
      const detailedError = error?.error?.details || error?.details || '';
      const fullErrorMessage = detailedError 
        ? `오류: ${errorMessage}\n\n상세: ${detailedError}\n\nSupabase DB에 저장되지 않았습니다.`
        : `오류: ${errorMessage}\n\nSupabase DB에 저장되지 않았습니다.`;
      
      alert(fullErrorMessage);
      
      // CRITICAL: Do NOT close the form on error - let user retry
      // Do NOT save to localStorage - abort operation
      return;
    }
  };

  const sources = Array.from(new Set(pressReleases.map((p) => p.source)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">보도자료 관리</h1>
            <p className="text-muted-foreground">보도자료를 등록, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 보도자료 등록
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">출처</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">전체</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
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
                  placeholder="제목, 출처, URL 검색..."
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
                  <option value="date">날짜</option>
                  <option value="source">출처</option>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingPress ? "보도자료 수정" : "새 보도자료 등록"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowForm(false);
                  setEditingPress(null);
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">제목 *</label>
                  <Input
                    name="title"
                    defaultValue={editingPress?.title}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">날짜</label>
                    <Input
                      name="date"
                      type="date"
                      defaultValue={editingPress?.date}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">출처</label>
                    <Input
                      name="source"
                      defaultValue={editingPress?.source}
                      className="w-full"
                      placeholder="예: 매일경제"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">URL</label>
                  <Input
                    name="url"
                    type="url"
                    defaultValue={editingPress?.url}
                    className="w-full"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      정렬 순서 (낮을수록 먼저 표시)
                    </label>
                    <Input
                      name="sortOrder"
                      type="number"
                      defaultValue={editingPress?.sortOrder ?? 0}
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
                      defaultValue={editingPress?.publishedAt ? new Date(editingPress.publishedAt).toISOString().slice(0, 16) : ""}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      비워두면 현재 시간으로 설정됩니다
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingPress ? "수정" : "등록"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPress(null);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">제목</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">출처</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">날짜</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">등록일</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredPressReleases.map((press) => (
                  <tr key={press.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{press.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{press.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                        {press.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{press.date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(press.createdAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(press)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(press.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPressReleases.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              등록된 보도자료가 없습니다.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
