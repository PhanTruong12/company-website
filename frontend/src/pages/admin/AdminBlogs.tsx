import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authService } from '../../features/admin/lib/auth';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import {
  deleteAdminBlog,
  getAdminBlogs,
} from '../../features/admin/api';
import { subscribeBlogUpdated } from '../../utils/blogSync';
import './AdminBlogs.css';

const AdminBlogs = () => {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: getAdminBlogs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  const sortedBlogs = useMemo(
    () => [...(blogsQuery.data ?? [])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [blogsQuery.data]
  );

  useEffect(() => {
    const unsubscribe = subscribeBlogUpdated(() => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa bài blog này?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/internal/admin/login';
  };

  const totalViews = sortedBlogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = sortedBlogs.reduce((sum, blog) => sum + blog.likes, 0);
  const totalDislikes = sortedBlogs.reduce((sum, blog) => sum + blog.dislikes, 0);
  const recentActivity = sortedBlogs.slice(0, 5).map((blog) => ({
    title: blog.title,
    meta: `Cập nhật: ${new Date(blog.updatedAt).toLocaleString('vi-VN')}`,
  }));

  return (
    <AdminDashboardLayout
      title="Dashboard Quản Lý Blog"
      subtitle="Đăng mới, chỉnh sửa và theo dõi hiệu suất bài viết."
      activeTab="blogs"
      onLogout={handleLogout}
      actions={
        <Link to="/internal/admin/blogs/new" className="btn-primary">
          + Đăng Blog Mới
        </Link>
      }
      stats={[
        { label: 'Tổng bài viết', value: sortedBlogs.length },
        { label: 'Tổng lượt xem', value: totalViews },
        { label: 'Bài nhiều tương tác', value: sortedBlogs[0]?.title ?? 'Chưa có dữ liệu', hint: 'Dựa theo thời gian cập nhật' },
      ]}
      insights={[
        { title: 'Tổng lượt thích', value: totalLikes, tone: 'positive' },
        { title: 'Tổng lượt không thích', value: totalDislikes, tone: 'warning' },
        {
          title: 'Bài mới nhất',
          value: sortedBlogs[0] ? new Date(sortedBlogs[0].createdAt).toLocaleDateString('vi-VN') : 'N/A',
          tone: 'neutral',
        },
      ]}
      activityItems={recentActivity}
    >

      {blogsQuery.isLoading && <div className="admin-loading">Đang tải blog...</div>}
      {blogsQuery.error && <div className="admin-error">Không thể tải danh sách blog.</div>}

      {!blogsQuery.isLoading && !blogsQuery.error && (
        <>
          {sortedBlogs.length === 0 ? (
            <div className="admin-empty">Chưa có bài blog nào.</div>
          ) : (
            <div className="admin-blogs-list">
              {sortedBlogs.map((blog) => (
                <article key={blog._id} className="admin-blog-card">
                  {blog.coverImage ? <img src={blog.coverImage} alt={blog.title} className="admin-blog-cover" /> : null}
                  <h3>{blog.title}</h3>
                  <p className="admin-blog-meta">
                    👁 {blog.views} | 👍 {blog.likes} | 👎 {blog.dislikes}
                  </p>
                  <p className="admin-blog-content">{blog.description || blog.content}</p>
                  <div className="admin-blog-actions">
                    <Link className="btn-edit" to={`/internal/admin/blogs/${blog._id}/edit`}>
                      Sửa
                    </Link>
                    <button className="btn-delete" onClick={() => handleDelete(blog._id)}>
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

    </AdminDashboardLayout>
  );
};

export default AdminBlogs;
