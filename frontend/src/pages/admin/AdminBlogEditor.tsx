import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Quill from 'quill';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../features/admin/lib/auth';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { createAdminBlog, getAdminBlogs, updateAdminBlog } from '../../features/admin/api';
import { subscribeBlogUpdated } from '../../utils/blogSync';
import './AdminBlogs.css';
import 'quill/dist/quill.snow.css';

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', content: '', coverImage: '' });
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [showQuickImageInsert, setShowQuickImageInsert] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const blogsQuery = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: getAdminBlogs,
  });

  const editingBlog = useMemo(() => {
    if (!id) return null;
    return (blogsQuery.data ?? []).find((item) => item._id === id) ?? null;
  }, [blogsQuery.data, id]);

  useEffect(() => {
    if (!editorContainerRef.current || quillRef.current) return;

    const quill = new Quill(editorContainerRef.current, {
      theme: 'snow',
      placeholder: 'Nhập nội dung bài viết...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
      },
    });

    quill.on('text-change', () => {
      setFormData((prev) => ({ ...prev, content: quill.root.innerHTML }));
    });
    quillRef.current = quill;
  }, []);

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title,
        slug: editingBlog.slug ?? '',
        description: editingBlog.description ?? '',
        content: editingBlog.content,
        coverImage: editingBlog.coverImage ?? '',
      });
      setCoverPreview(editingBlog.coverImage ?? '');
    }
  }, [editingBlog]);

  useEffect(() => {
    if (!slugTouched && formData.title) {
      setFormData((prev) => ({ ...prev, slug: makeSlug(prev.title) }));
    }
  }, [formData.title, slugTouched]);

  useEffect(() => {
    if (!quillRef.current) return;
    if (quillRef.current.root.innerHTML !== formData.content) {
      quillRef.current.root.innerHTML = formData.content || '';
    }
  }, [formData.content]);

  const createMutation = useMutation({
    mutationFn: createAdminBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { title: string; slug?: string; description?: string; content: string; coverImage?: string }) => {
      if (!id) throw new Error('Thiếu ID blog');
      return updateAdminBlog(id, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const insertInlineImage = () => {
    const url = inlineImageUrl.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      content: `${prev.content || ''}<p><img src="${url}" alt="Hình minh họa" /></p>`,
    }));
    setInlineImageUrl('');
  };

  const handlePickCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setFormData((prev) => ({ ...prev, coverImage: dataUrl }));
      setCoverPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (isEditMode) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }

    navigate('/internal/admin/blogs');
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/internal/admin/login';
  };

  const isNotFound = isEditMode && !blogsQuery.isLoading && !editingBlog;

  useEffect(() => {
    const unsubscribe = subscribeBlogUpdated((payload) => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      if (isEditMode && id && payload.action === 'deleted' && payload.postId === id) {
        navigate('/internal/admin/blogs');
      }
    });
    return unsubscribe;
  }, [id, isEditMode, navigate, queryClient]);

  return (
    <AdminDashboardLayout
      title={isEditMode ? 'Chỉnh Sửa Blog' : 'Tạo Blog Mới'}
      subtitle="Soạn nội dung bằng editor và xuất bản ngay trên website."
      activeTab="blogs"
      showUtilitySection={false}
      onLogout={handleLogout}
      actions={
        <Link to="/internal/admin/blogs" className="btn-secondary">
          ← Quay lại danh sách
        </Link>
      }
    >
      {blogsQuery.isLoading && isEditMode && <div className="admin-loading">Đang tải dữ liệu blog...</div>}
      {isNotFound && <div className="admin-error">Không tìm thấy bài blog cần chỉnh sửa.</div>}

      {(!isEditMode || editingBlog) && (
        <div className="admin-blog-editor-shell">
          <form onSubmit={handleSubmit} className="admin-blog-editor-form">
            <section className="admin-blog-editor-card">
              <h3 className="admin-blog-section-title">Thông tin bài viết</h3>
              <div className="admin-blog-form-grid">
                <div className="admin-form-field">
                  <label>Tên bài viết</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="admin-form-field">
                  <label>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setFormData((prev) => ({ ...prev, slug: makeSlug(e.target.value) }));
                    }}
                  />
                </div>
              </div>
              <div className="admin-form-field">
                <label>Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn hiển thị ở danh sách bài viết"
                />
              </div>
            </section>

            <section className="admin-blog-editor-card">
              <h3 className="admin-blog-section-title">Ảnh đại diện</h3>
              <div className="admin-form-field">
                <label>Ảnh (tùy chọn)</label>
                <div className="admin-cover-dropzone">
                  {coverPreview ? <img src={coverPreview} alt="Ảnh bìa" className="admin-cover-preview" /> : null}
                  <button type="button" className="btn-secondary admin-cover-picker-btn" onClick={() => imageInputRef.current?.click()}>
                    Chọn ảnh
                  </button>
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handlePickCover} className="admin-hidden-file" />
                </div>
                <small className="admin-form-hint">Bạn có thể bỏ qua mục này nếu bài viết chỉ cần tiêu đề và nội dung chữ.</small>
              </div>
            </section>

            <section className="admin-blog-editor-card">
              <h3 className="admin-blog-section-title">Nội dung</h3>
              <div className="admin-form-field">
                <label>Nội dung bài viết</label>
                <div className="admin-quill-editor" ref={editorContainerRef} />
                <small className="admin-form-hint">Editor hỗ trợ chèn link, ảnh, video ngay trên toolbar.</small>
              </div>
              <div className="admin-form-field">
                <label>Chèn ảnh URL nhanh vào nội dung (Tùy chọn)</label>
                <button
                  type="button"
                  className="btn-secondary admin-optional-toggle"
                  onClick={() => setShowQuickImageInsert((prev) => !prev)}
                >
                  {showQuickImageInsert ? 'Ẩn mục này' : 'Mở mục tùy chọn'}
                </button>
                {showQuickImageInsert ? (
                  <div className="admin-inline-image-tool">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={inlineImageUrl}
                      onChange={(e) => setInlineImageUrl(e.target.value)}
                    />
                    <button type="button" className="btn-secondary" onClick={insertInlineImage}>
                      + Chèn vào nội dung
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            <div className="admin-modal-actions">
              <Link to="/internal/admin/blogs" className="btn-secondary">
                Hủy
              </Link>
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : isEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminBlogEditor;
