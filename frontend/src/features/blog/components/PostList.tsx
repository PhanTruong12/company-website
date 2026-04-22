import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api';
import { subscribeBlogUpdated } from '../../../utils/blogSync';

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const PostList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const postsQuery = useQuery({
    queryKey: ['blog-posts'],
    queryFn: blogApi.getPosts,
  });

  const filteredPosts = useMemo(() => {
    const source = postsQuery.data ?? [];
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return source;
    return source.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
    );
  }, [postsQuery.data, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagedPosts = useMemo(() => {
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, totalPages]);

  useEffect(() => {
    const unsubscribe = subscribeBlogUpdated(() => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    });
    return unsubscribe;
  }, [queryClient]);

  if (postsQuery.isLoading) {
    return <p className="blog-filter-meta">Đang tải bài viết...</p>;
  }

  if (postsQuery.error) {
    return <p className="blog-filter-meta">Không thể tải danh sách bài viết.</p>;
  }

  if (!postsQuery.data?.length) {
    return (
      <div className="blog-panel">
        Chưa có bài viết nào.
      </div>
    );
  }

  return (
    <div>
      <div className="blog-filter">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="blog-search"
          placeholder="Tìm bài viết theo tiêu đề hoặc nội dung..."
        />
        <p className="blog-filter-meta">
          Hiển thị {pagedPosts.length} / {filteredPosts.length} bài
        </p>
      </div>

      {pagedPosts.length === 0 ? (
        <div className="blog-panel">
          Không có bài viết phù hợp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="blog-grid">
          {pagedPosts.map((post) => (
            <article key={post._id} className="blog-card">
              {post.coverImage ? <img src={post.coverImage} alt={post.title} className="blog-card-image" /> : null}
              <p className="blog-card-date">
                Đăng lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}
              </p>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.description || stripHtml(post.content)}</p>
              <div className="blog-card-footer">
                <span className="blog-stats-pill">
                  👍 {post.likes} · 👎 {post.dislikes} · 👁 {post.views}
                </span>
                <Link to={`/blog/${post._id}`} className="blog-read-link">
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="blog-pagination">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
          className="blog-page-btn"
        >
          Trước
        </button>
        <span className="blog-filter-meta">
          Trang {Math.min(page, totalPages)} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
          className="blog-page-btn"
        >
          Sau
        </button>
      </div>
    </div>
  );
};
