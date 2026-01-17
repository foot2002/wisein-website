import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts, saveNewsletterSubscriber, type BlogPost } from "@/lib/adminStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = ["전체", "인사이트", "기술", "케이스스터디", "리서치"];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [email, setEmail] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    // 관리자 페이지에서 등록한 블로그 데이터 로드
    const loadData = async () => {
      const blogData = await getBlogPosts();
      // 최신순으로 정렬
      const sorted = [...blogData].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    };
    loadData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValue = email.trim();
    
    if (!emailValue) {
      alert("이메일 주소를 입력해주세요.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    const result = await saveNewsletterSubscriber(emailValue);
    
    if (result) {
      setShowSuccessDialog(true);
      setEmail("");
    } else {
      alert("이미 구독 중인 이메일 주소입니다.");
    }
  };

  // Featured post는 가장 최근 포스트
  const featuredPost = posts.length > 0 ? posts[0] : null;
  
  // 나머지 포스트들
  const otherPosts = posts.slice(1);
  
  // 카테고리 필터링
  const filteredPosts = selectedCategory === "전체" 
    ? otherPosts 
    : otherPosts.filter(p => p.category === selectedCategory);
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-subtle">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent font-medium mb-4">BLOG</p>
            <h1 className="text-4xl md:text-display font-bold text-foreground mb-6">
              인사이트 & 기술 블로그
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              데이터와 AI에 대한 인사이트, 기술 동향, 프로젝트 사례를 공유합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-border bg-card">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container">
            <article className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-display-sm font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime} 읽기
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/blog/${featuredPost.id}`}>
                      자세히 읽기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center overflow-hidden">
                  {featuredPost.imageUrl ? (
                    <img 
                      src={featuredPost.imageUrl} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl font-bold text-primary/20">{featuredPost.category}</div>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Post Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 block"
                  >
                    <div className="aspect-video bg-gradient-to-br from-muted to-secondary flex items-center justify-center overflow-hidden">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-muted-foreground/30">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">등록된 블로그 포스트가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-display-sm font-bold text-foreground mb-4">
              뉴스레터 구독
            </h2>
            <p className="text-muted-foreground mb-8">
              매주 데이터와 AI에 대한 인사이트를 이메일로 받아보세요.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <Button type="submit">구독하기</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구독 신청 완료</AlertDialogTitle>
            <AlertDialogDescription>
              구독신청이 완료되었습니다. 앞으로 와이즈인컴퍼니의 새로운 소식을 보내드리겠습니다. 감사합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
