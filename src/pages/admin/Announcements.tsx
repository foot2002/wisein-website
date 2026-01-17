import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAnnouncements,
  saveAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/adminStorage";
import { Trash2, ArrowUpDown, Search, Edit, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SortField = "createdAt" | "date" | "category" | "title";
type SortOrder = "asc" | "desc";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [announcements, selectedCategory, searchQuery, sortField, sortOrder]);

  const loadAnnouncements = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  const filterAndSort = () => {
    let filtered = [...announcements];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
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

    setFilteredAnnouncements(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteAnnouncement(id);
      loadAnnouncements();
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      category: formData.get("category") as string,
      content: formData.get("content") as string,
    };

    if (editingAnnouncement) {
      await updateAnnouncement(editingAnnouncement.id, data);
    } else {
      await saveAnnouncement(data);
    }

    setShowForm(false);
    setEditingAnnouncement(null);
    loadAnnouncements();
  };

  const categories = ["서비스", "교육", "시스템", "공지", "인증", "이벤트"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">공지사항 관리</h1>
            <p className="text-muted-foreground">공지사항을 등록, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 공지사항 등록
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">카테고리</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">전체</option>
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
                  placeholder="제목, 내용, 카테고리 검색..."
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
                  <option value="category">카테고리</option>
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
                  {editingAnnouncement ? "공지사항 수정" : "새 공지사항 등록"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowForm(false);
                  setEditingAnnouncement(null);
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">제목 *</label>
                  <Input
                    name="title"
                    defaultValue={editingAnnouncement?.title}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">날짜 *</label>
                    <Input
                      name="date"
                      type="date"
                      defaultValue={editingAnnouncement?.date}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">카테고리 *</label>
                    <select
                      name="category"
                      defaultValue={editingAnnouncement?.category}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">내용 *</label>
                  <textarea
                    name="content"
                    defaultValue={editingAnnouncement?.content}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    {editingAnnouncement ? "수정" : "등록"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAnnouncement(null);
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">카테고리</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">날짜</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">등록일</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{announcement.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{announcement.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                        {announcement.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{announcement.date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(announcement.createdAt), "yyyy.MM.dd", { locale: ko })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
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
          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              등록된 공지사항이 없습니다.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
