import { PostList } from '../features/blog/components/PostList';
import '../features/blog/blog.css';

export default function Blog() {
  return (
    <div className="blog-page">
      <div className="blog-shell">
        <header className="blog-hero">
          <div className="blog-hero-content">
            <p className="blog-pill">Mini Blog</p>
            <h1 className="blog-hero-title">Tin tức, chia sẻ và cảm nhận về đá ốp lát</h1>
            <p className="blog-hero-subtitle">
              Theo dõi các bài viết mới nhất, nhấn Like hoặc Dislike theo trải nghiệm của bạn và xem độ quan tâm qua lượt xem.
            </p>
          </div>
        </header>

        <section className="blog-panel">
          <div className="blog-panel-header">
            <h2 className="blog-panel-title">Danh sách bài viết</h2>
            <span className="blog-panel-badge">Cập nhật liên tục</span>
          </div>
          <PostList />
        </section>
      </div>
    </div>
  );
}
