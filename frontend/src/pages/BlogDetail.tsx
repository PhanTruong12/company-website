import { Link, useParams } from 'react-router-dom';
import { PostDetail } from '../features/blog/components/PostDetail';
import '../features/blog/blog.css';

export default function BlogDetail() {
  const { id } = useParams();

  if (!id) {
    return <p className="blog-filter-meta">Thiếu ID bài viết.</p>;
  }

  return (
    <div className="blog-page">
      <div className="blog-shell" style={{ maxWidth: '980px' }}>
        <Link to="/blog" className="blog-detail-back">
          ← Quay lại Blog
        </Link>
        <PostDetail postId={id} />
      </div>
    </div>
  );
}
