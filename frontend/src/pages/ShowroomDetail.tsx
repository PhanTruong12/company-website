// ShowroomDetail.tsx - Trang chi tiết showroom theo slug
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './ShowroomDetail.css';

export const ShowroomDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Tạm thời: Tìm image theo slug (cần backend API để tìm theo slug)
    // Hiện tại sẽ redirect về showroom với filter
    if (slug) {
      // Giả định slug format: "da-marble-trang-van-may"
      // Có thể decode và tìm kiếm
      navigate(`/showroom?search=${slug}`, { replace: true });
    } else {
      navigate('/showroom', { replace: true });
    }
  }, [slug, navigate]);

  // Hiển thị loading trong lúc redirect
  return <div className="showroom-detail-loading">Đang tải...</div>;
};

