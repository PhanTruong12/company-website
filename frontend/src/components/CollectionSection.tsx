import { Link } from 'react-router-dom';
import { publicAsset } from '../utils/publicAsset';

const collections = [
  {
    title: 'Bộ Sưu Tập Đá Thạch Anh',
    desc: 'Sự kết hợp tinh tế giữa công nghệ và thẩm mỹ, đá nung kết mang đến vẻ đẹp tự nhiên cùng độ bền Bộ sưu tập đá thạch anh mang đến vẻ đẹp hiện đại, sang trọng và tinh tế, tạo điểm nhấn độc đáo cho không gian nội thất của bạn.chắc lâu dài cho nội thất ngôi nhà.',
    img: publicAsset('collection.jpg'),
    stoneType: 'Thạch Anh',
    id: 'thach-anh',
  },
  {
    title: 'Bộ Sưu Tập Đá Nung Kết',
    desc: 'Sự kết hợp tinh tế giữa công nghệ và thẩm mỹ, đá nung kết mang đến vẻ đẹp tự nhiên cùng độ bền chắc lâu dài cho nội thất ngôi nhà.',
    img: publicAsset('collection2.jpg'),
    stoneType: 'Nung Kết',
    id: 'nung-ket',
  },
  {
    title: 'Bộ Sưu Tập Đá Tự Nhiên',
    desc: 'Bộ sưu tập đá tự nhiên mang vẻ đẹp nguyên bản, độc nhất vô nhị của thiên nhiên, tạo điểm nhấn sang trọng và đẳng cấp cho không gian sống.',
    img: publicAsset('collection3.jpg'),
    stoneType: 'Tự Nhiên',
    id: 'tu-nhien',
  },
];

const CollectionSection = () => (
  <>
    {collections.map((item, idx) => {
      // Tạo URL với query parameter được encode đúng cách
      const href = `/showroom?stoneType=${encodeURIComponent(item.stoneType)}`;
      
      return (
        <section
          key={item.id}
          id={item.id}
          className="collection-section"
        >
          <div className={`collection-container ${idx % 2 === 1 ? 'collection-reverse' : ''}`}>
            <div className="collection-image">
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
              />
            </div>
            <div className="collection-content">
              <h3 className="collection-title">{item.title}</h3>
              <p className="collection-desc">
                {item.desc}
              </p>
              <Link className="collection-link" to={href}>
                Xem Thêm &gt;&gt;
              </Link>
            </div>
          </div>
        </section>
      );
    })}
  </>
);

export default CollectionSection;

