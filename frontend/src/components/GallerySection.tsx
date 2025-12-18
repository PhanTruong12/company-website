import { useRef, useState, useEffect } from 'react';

const galleryItems = [
  { img: '/gallery1.jpg', alt: 'Mẫu đá 1' },
  { img: '/gallery2.jpg', alt: 'Mẫu đá 2' },
  { img: '/gallery3.jpg', alt: 'Mẫu đá 3' },
];

const GallerySection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
      carouselRef.current.style.scrollSnapType = 'none';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5; // Tốc độ kéo
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-heading">
        <h2>Hơn 150 mẫu đá cho bạn lựa chọn</h2>
        <p>
          TND Granite mang đến hơn 150 mẫu đá đa dạng, với thiết kế độc đáo và vân đá tinh xảo,
          đáp ứng mọi phong cách nội thất.
        </p>
      </div>
      <div className="gallery-carousel-wrapper">
        <div className="gallery-carousel-container">
          <div
            ref={carouselRef}
            className="gallery-carousel"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {galleryItems.map((item, idx) => (
              <div className="gallery-card" key={`${item.img}-${idx}`}>
                <img src={item.img} alt={item.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

