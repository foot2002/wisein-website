import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { getBlogPostById, type BlogPost } from "@/lib/adminStorage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (id) {
      const loadPost = async () => {
        const postData = await getBlogPostById(parseInt(id));
        if (postData) {
          setPost(postData);
        }
      };
      loadPost();
    }
  }, [id]);

  if (!post) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="text-muted-foreground mb-4">포스트를 찾을 수 없습니다.</p>
          <Button asChild>
            <Link to="/blog">블로그로 돌아가기</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-24 gradient-subtle">
        <div className="container">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-display font-bold text-foreground mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime} 읽기
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <article className="max-w-4xl mx-auto">
            {post.imageUrl && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </div>
              {post.content && (
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>
              )}
              {!post.content && (
                <div className="text-foreground leading-relaxed">
                  {post.excerpt}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild size="lg">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                블로그 목록으로
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
