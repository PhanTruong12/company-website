// CollectionRedirect.tsx - Redirect từ collection route sang showroom với filter
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CollectionRedirect = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Map collectionId sang các biến thể tên loại đá có thể có
    // Backend có thể trả về: "Thạch Anh", "Đá thạch anh", "thạch anh", etc.
    const stoneTypeMap: { [key: string]: string[] } = {
      'thach-anh': ['Thạch Anh', 'Đá thạch anh', 'thạch anh'],
      'nung-ket': ['Nung Kết', 'Đá nung kết', 'nung kết'],
      'tu-nhien': ['Tự Nhiên', 'Đá tự nhiên', 'tự nhiên'],
    };

    const possibleNames = stoneTypeMap[collectionId || ''];
    
    if (possibleNames && possibleNames.length > 0) {
      // Sử dụng tên đầu tiên (chuẩn nhất) để filter
      // Showroom sẽ tự động match với các biến thể khác
      const stoneType = possibleNames[0];
      navigate(`/showroom?stoneType=${encodeURIComponent(stoneType)}`, { replace: true });
    } else {
      // Nếu không tìm thấy, redirect về showroom không filter
      navigate('/showroom', { replace: true });
    }
  }, [collectionId, navigate]);

  // Hiển thị loading trong lúc redirect
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Đang chuyển hướng...
    </div>
  );
};

export default CollectionRedirect;

