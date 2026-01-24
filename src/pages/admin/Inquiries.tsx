import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getInquiries,
  updateInquiry,
  deleteInquiry,
  type Inquiry,
} from "@/lib/adminStorage";
import { sendInquiryReplyEmail } from "@/lib/emailService";
import { Trash2, ArrowUpDown, Search, CheckCircle2, Clock, Mail } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SortField = "createdAt" | "status" | "type" | "name";
type SortOrder = "asc" | "desc";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [inquiries, selectedStatus, searchQuery, sortField, sortOrder]);

  const loadInquiries = async () => {
    const data = await getInquiries();
    setInquiries(data);
  };

  const filterAndSort = () => {
    let filtered = [...inquiries];

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((inquiry) => inquiry.status === selectedStatus);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inquiry) =>
          inquiry.name.toLowerCase().includes(query) ||
          inquiry.email.toLowerCase().includes(query) ||
          inquiry.company.toLowerCase().includes(query) ||
          inquiry.message.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInquiries(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteInquiry(id);
      loadInquiries();
    }
  };

  const handleReply = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText(inquiry.reply || "");
  };

  const handleReplySubmit = async () => {
    if (!selectedInquiry || !replyText.trim()) return;

    setSendingEmail(true);

    try {
      // 이메일 전송
      let emailResult = { success: false, error: null as string | null };
      try {
        emailResult = await sendInquiryReplyEmail({
          to: selectedInquiry.email,
          name: selectedInquiry.name,
          inquiryMessage: selectedInquiry.message,
          replyMessage: replyText.trim(),
        });
      } catch (emailError: any) {
        console.error("Error sending email:", emailError);
        emailResult.error = emailError?.message || '이메일 전송 중 오류가 발생했습니다.';
      }

      // 답변 저장 (이메일 전송 성공 여부와 관계없이)
      try {
        await updateInquiry(selectedInquiry.id, {
          reply: replyText.trim(),
        });

        if (emailResult.success) {
          alert("답변이 저장되었고 이메일이 전송되었습니다.");
        } else {
          alert(`이메일 전송에 실패했습니다.\n\n${emailResult.error || '알 수 없는 오류'}\n\n답변은 저장되었습니다.`);
        }
        
        setSelectedInquiry(null);
        setReplyText("");
        loadInquiries(); // Re-fetch from Supabase
      } catch (dbError: any) {
        console.error("Failed to save inquiry reply:", dbError);
        const errorMessage = dbError?.message || dbError?.error?.message || '답변 저장 중 오류가 발생했습니다.';
        alert(`오류: ${errorMessage}\n\nSupabase DB에 저장되지 않았습니다.`);
        // Do NOT clear the form on error - let user retry
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("예상치 못한 오류가 발생했습니다.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">문의글 관리</h1>
          <p className="text-muted-foreground">고객 문의를 확인하고 답변할 수 있습니다.</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">상태</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "all" | "pending" | "replied")}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">전체</option>
                <option value="pending">답변 대기</option>
                <option value="replied">답변 완료</option>
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
                  placeholder="이름, 이메일, 회사, 내용 검색..."
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
                  <option value="status">상태</option>
                  <option value="type">문의 유형</option>
                  <option value="name">이름</option>
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

        {/* Reply Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">답변 작성</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">문의 내용</label>
                  <div className="p-4 bg-secondary/50 rounded-lg text-sm text-foreground whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">답변 내용 *</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                    placeholder="답변 내용을 입력하세요"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={handleReplySubmit} 
                  className="flex-1"
                  disabled={sendingEmail || !replyText.trim()}
                >
                  {sendingEmail ? (
                    <>
                      <Mail className="h-4 w-4 mr-2 animate-pulse" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      답변 저장 및 이메일 전송
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInquiry(null);
                    setReplyText("");
                  }}
                  disabled={sendingEmail}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-foreground">{inquiry.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inquiry.status === "replied"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {inquiry.status === "replied" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          답변 완료
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          답변 대기
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>이메일: {inquiry.email}</div>
                    <div>회사: {inquiry.company || "-"}</div>
                    <div>연락처: {inquiry.phone || "-"}</div>
                    <div>문의 유형: {inquiry.type}</div>
                    <div>등록일: {format(new Date(inquiry.createdAt), "yyyy.MM.dd HH:mm", { locale: ko })}</div>
                    {inquiry.repliedAt && (
                      <div>답변일: {format(new Date(inquiry.repliedAt), "yyyy.MM.dd HH:mm", { locale: ko })}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {inquiry.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReply(inquiry)}
                    >
                      답변하기
                    </Button>
                  )}
                  {inquiry.status === "replied" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReply(inquiry)}
                    >
                      답변 수정
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(inquiry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">문의 내용</label>
                <div className="p-4 bg-secondary/50 rounded-lg text-sm text-foreground whitespace-pre-wrap">
                  {inquiry.message}
                </div>
              </div>
              {inquiry.reply && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">답변 내용</label>
                  <div className="p-4 bg-primary/10 rounded-lg text-sm text-foreground whitespace-pre-wrap">
                    {inquiry.reply}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredInquiries.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
              등록된 문의가 없습니다.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
