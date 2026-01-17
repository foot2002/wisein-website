import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
  type NewsletterSubscriber,
} from "@/lib/adminStorage";
import { Trash2, ArrowUpDown, Search, Mail } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SortField = "createdAt" | "email";
type SortOrder = "asc" | "desc";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [subscribers, searchQuery, sortField, sortOrder]);

  const loadSubscribers = async () => {
    const data = await getNewsletterSubscribers();
    setSubscribers(data);
  };

  const filterAndSort = () => {
    let filtered = [...subscribers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (subscriber) =>
          subscriber.email.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSubscribers(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteNewsletterSubscriber(id);
      loadSubscribers();
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">뉴스레터 구독자 관리</h1>
            <p className="text-muted-foreground">뉴스레터 구독자 목록을 확인하고 관리할 수 있습니다.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="이메일 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    <button
                      onClick={() => toggleSort("email")}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      이메일
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    <button
                      onClick={() => toggleSort("createdAt")}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      구독일
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-accent/60" />
                          <span className="text-foreground font-medium">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">
                          {format(new Date(subscriber.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subscriber.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                      {searchQuery ? "검색 결과가 없습니다." : "구독자가 없습니다."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 구독자 수</p>
              <p className="text-2xl font-bold text-foreground">{subscribers.length}명</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">검색 결과</p>
              <p className="text-2xl font-bold text-foreground">{filteredSubscribers.length}명</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
