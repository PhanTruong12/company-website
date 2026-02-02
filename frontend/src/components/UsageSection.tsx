// UsageSection.tsx - Component hiển thị các công năng sử dụng đá
import './UsageSection.css';
import { publicAsset } from '../utils/publicAsset';

interface UsageItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const usageItems: UsageItem[] = [
  {
    id: 'kitchen',
    title: 'Nhà Bếp',
    description: 'Sản phẩm TND Granite luôn làm nổi bật không gian bếp của bạn với khả năng chống thấm, chống bám bẩn, độ bền cao và đa màu trang nhã ấn tượng',
    image: publicAsset('collection2.jpg'),
  },
  {
    id: 'staircase',
    title: 'Cầu Thang',
    description: 'Đá tự nhiên và nhân tạo tạo nên những bậc cầu thang sang trọng, bền đẹp theo thời gian với khả năng chống trơn trượt tốt',
    image: publicAsset('collection.jpg'),
  },
  {
    id: 'bathroom',
    title: 'Phòng Tắm',
    description: 'TND Granite cung cấp phổ thiết kế với màu sắc tinh tế, phù hợp với phong cách từ cổ điển đến hiện đại. Đặc tính chống thấm, dễ bảo dưỡng của đá nhân tạo thạch anh là sự lựa chọn tối ưu cho phòng tắm của bạn',
    image: publicAsset('collection3.jpg'),
  },
  {
    id: 'facade',
    title: 'Mặt Tiền',
    description: 'TND Granite luôn cung cấp các loại đá có độ bền cao, khả năng chịu mài mòn tốt, là vật liệu thích hợp nhất cho mọi công trình thương mại',
    image: publicAsset('collection.jpg'),
  },
];

const UsageSection = () => {
  return (
    <section className="usage-section">
      <div className="usage-container">
        <h2 className="usage-title">Công Năng Sử Dụng</h2>
        <div className="usage-grid">
          {usageItems.map((item) => (
            <div key={item.id} className="usage-card">
              <div className="usage-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="usage-image"
                  loading="lazy"
                />
                <div className="usage-overlay">
                  <div className="usage-content">
                    <h3 className="usage-card-title">{item.title}</h3>
                    <p className="usage-card-description">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsageSection;

