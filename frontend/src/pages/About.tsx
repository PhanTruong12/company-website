// About.tsx - Trang Giới thiệu công ty
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* H1 - Tiêu đề chính */}
        <header className="about-header">
          <h1 className="about-h1">Giới thiệu Công Ty TNHH TM & TK Tường Nhà Đẹp</h1>
          <div className="about-hero-image">
            <img 
              src="/collection.jpg" 
              alt="Công trình ốp đá thực tế - Showroom đá nội thất" 
              loading="lazy"
            />
            <p className="image-caption">[Hình minh họa: Công trình ốp đá thực tế / Showroom đá / Thi công đá nội thất]</p>
          </div>
        </header>

        {/* H2 - Tổng quan */}
        <section className="about-section">
          <h2 className="about-h2">Tổng quan về Tường Nhà Đẹp</h2>
          <div className="about-content-with-image">
            <div className="about-text">
              <p>
                Công Ty TNHH TM & TK Tường Nhà Đẹp là đơn vị chuyên cung cấp, thi công và lắp đặt đá ốp lát cao cấp, 
                mang đến những giải pháp hoàn hảo cho không gian sống và làm việc. Với định hướng hoạt động tập trung 
                vào chất lượng và thẩm mỹ, chúng tôi cam kết mang đến cho khách hàng những sản phẩm đá tự nhiên và nhân tạo 
                đẳng cấp, kết hợp cùng dịch vụ thi công chuyên nghiệp.
              </p>
              <p>
                Giá trị cốt lõi của Tường Nhà Đẹp nằm ở việc tạo ra những không gian đẹp mắt, sang trọng với độ bền vượt trội 
                theo thời gian. Mỗi công trình được thực hiện đều được đảm bảo về mặt kỹ thuật, thẩm mỹ và tính ứng dụng thực tế, 
                đáp ứng mọi nhu cầu từ thi công đá ốp lát nội thất đến ngoại thất.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img 
                src="/collection2.jpg" 
                alt="Đội ngũ thi công chuyên nghiệp - Công trình hoàn thiện" 
                loading="lazy"
              />
              <p className="image-caption">[Hình minh họa: Đội ngũ thi công hoặc công trình hoàn thiện]</p>
            </div>
          </div>
        </section>

        {/* H2 - Dịch vụ */}
        <section className="about-section">
          <h2 className="about-h2">Dịch vụ cung cấp & thi công đá ốp lát</h2>
          
          <h3 className="about-h3">Quy trình cung cấp – thi công – lắp đặt chuyên nghiệp</h3>
          <div className="about-content-with-image">
            <div className="about-text">
              <p>
                Quy trình làm việc tại Tường Nhà Đẹp được xây dựng trên nền tảng chuyên nghiệp và khoa học, đảm bảo từng 
                bước được thực hiện một cách chính xác và hiệu quả. Bắt đầu từ việc tư vấn và khảo sát công trình, chúng tôi 
                phân tích không gian, đề xuất giải pháp phù hợp với công năng sử dụng và ngân sách của khách hàng.
              </p>
              <p>
                Giai đoạn thi công được giám sát chặt chẽ bởi đội ngũ kỹ thuật giàu kinh nghiệm, đảm bảo từng viên đá được 
                lắp đặt đúng kỹ thuật, đạt độ phẳng và độ bền cao nhất. Quy trình lắp đặt đá granite, marble và các dòng đá cao cấp 
                khác được thực hiện với công nghệ hiện đại, đảm bảo tính thẩm mỹ và độ bền lâu dài cho công trình.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img 
                src="/collection3.jpg" 
                alt="Quy trình thi công và lắp đặt đá ốp lát" 
                loading="lazy"
              />
              <p className="image-caption">[Hình minh họa: Quy trình thi công hoặc lắp đặt thực tế]</p>
            </div>
          </div>
        </section>

        {/* H2 - Các dòng đá */}
        <section className="about-section">
          <h2 className="about-h2">Các dòng đá cao cấp Tường Nhà Đẹp cung cấp</h2>

          <div className="stone-types-grid">
            <div className="stone-type-item">
              <div className="stone-type-image">
                <img 
                  src="/collection.jpg" 
                  alt="Đá Granite - Bền bỉ và sang trọng" 
                  loading="lazy"
                />
                <p className="image-caption">[Hình minh họa: Mẫu đá Granite / Ứng dụng thực tế]</p>
              </div>
              <h3 className="about-h3">Đá Granite – Bền bỉ & sang trọng</h3>
              <p>
                Đá Granite là một trong những vật liệu được ưa chuộng nhất trong thi công đá ốp lát nhờ độ cứng cao, 
                khả năng chống thấm và chống trầy xước vượt trội. Với đa dạng màu sắc và vân đá tự nhiên, đá granite 
                mang đến vẻ đẹp sang trọng, phù hợp cho cả không gian nội thất và ngoại thất.
              </p>
            </div>

            <div className="stone-type-item">
              <div className="stone-type-image">
                <img 
                  src="/collection2.jpg" 
                  alt="Đá Marble - Tinh tế và đẳng cấp" 
                  loading="lazy"
                />
                <p className="image-caption">[Hình minh họa: Mẫu đá Marble / Ứng dụng thực tế]</p>
              </div>
              <h3 className="about-h3">Đá Marble – Tinh tế & đẳng cấp</h3>
              <p>
                Đá Marble với vân đá độc đáo và màu sắc tinh tế là lựa chọn hàng đầu cho những không gian cao cấp. 
                Vẻ đẹp tự nhiên của đá marble tạo nên điểm nhấn ấn tượng, phù hợp với phong cách thiết kế hiện đại và cổ điển. 
                Đây là vật liệu lý tưởng cho thi công đá cao cấp trong các công trình sang trọng.
              </p>
            </div>

            <div className="stone-type-item">
              <div className="stone-type-image">
                <img 
                  src="/collection3.jpg" 
                  alt="Đá Nung Kết - Xu hướng vật liệu hiện đại" 
                  loading="lazy"
                />
                <p className="image-caption">[Hình minh họa: Mẫu đá Nung Kết / Ứng dụng thực tế]</p>
              </div>
              <h3 className="about-h3">Đá Nung Kết – Xu hướng vật liệu hiện đại</h3>
              <p>
                Đá Nung Kết là xu hướng vật liệu hiện đại, kết hợp giữa công nghệ sản xuất tiên tiến và tính thẩm mỹ cao. 
                Với khả năng chống thấm tốt và độ bền vượt trội, đá nung kết là giải pháp tối ưu cho ốp đá nội thất và ngoại thất, 
                đặc biệt phù hợp với các công trình yêu cầu tính ứng dụng cao.
              </p>
            </div>

            <div className="stone-type-item">
              <div className="stone-type-image">
                <img 
                  src="/collection.jpg" 
                  alt="Đá Thạch Anh - Thẩm mỹ và độ bền vượt trội" 
                  loading="lazy"
                />
                <p className="image-caption">[Hình minh họa: Mẫu đá Thạch Anh / Ứng dụng thực tế]</p>
              </div>
              <h3 className="about-h3">Đá Thạch Anh – Thẩm mỹ & độ bền vượt trội</h3>
              <p>
                Đá Thạch Anh sở hữu độ cứng cao và khả năng chống bám bẩn tuyệt vời, là lựa chọn hoàn hảo cho không gian bếp 
                và phòng tắm. Với đa dạng màu sắc trang nhã và khả năng chống thấm vượt trội, đá thạch anh mang đến vẻ đẹp 
                hiện đại cùng độ bền lâu dài, đáp ứng mọi yêu cầu về thi công đá ốp lát cao cấp.
              </p>
            </div>
          </div>
        </section>

        {/* H2 - Thế mạnh */}
        <section className="about-section">
          <h2 className="about-h2">Thế mạnh & giá trị mang lại cho khách hàng</h2>
          <div className="about-content-with-image">
            <div className="about-text">
              <p>
                <strong>Tay nghề thi công:</strong> Đội ngũ thợ lành nghề với nhiều năm kinh nghiệm trong lĩnh vực thi công đá ốp lát, 
                đảm bảo mỗi công trình được thực hiện với độ chính xác cao và tính thẩm mỹ tối ưu.
              </p>
              <p>
                <strong>Chất lượng vật liệu:</strong> Chúng tôi chỉ cung cấp các dòng đá granite, marble, đá nung kết và đá thạch anh 
                cao cấp, được nhập khẩu và kiểm định chất lượng nghiêm ngặt, đảm bảo độ bền và vẻ đẹp lâu dài.
              </p>
              <p>
                <strong>Tư vấn phù hợp công năng & ngân sách:</strong> Với đội ngũ tư vấn chuyên nghiệp, Tường Nhà Đẹp giúp khách hàng 
                lựa chọn giải pháp tối ưu nhất, cân bằng giữa yêu cầu thẩm mỹ, công năng sử dụng và ngân sách đầu tư.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img 
                src="/collection2.jpg" 
                alt="Công trình hoàn thiện tổng thể - Thi công đá ốp lát" 
                loading="lazy"
              />
              <p className="image-caption">[Hình minh họa: Công trình hoàn thiện tổng thể]</p>
            </div>
          </div>
        </section>

        {/* H2 - Cam kết */}
        <section className="about-section">
          <h2 className="about-h2">Cam kết chất lượng & dịch vụ</h2>
          <div className="about-text">
            <p>
              <strong>Cam kết về vật liệu:</strong> Tất cả sản phẩm đá granite, marble, đá nung kết và đá thạch anh được cung cấp 
              đều đảm bảo chất lượng cao cấp, có nguồn gốc rõ ràng và đạt các tiêu chuẩn kỹ thuật trong thi công đá ốp lát.
            </p>
            <p>
              <strong>Cam kết về kỹ thuật thi công:</strong> Mỗi công trình được thi công theo đúng quy trình kỹ thuật, sử dụng 
              vật liệu và công cụ chuyên dụng, đảm bảo độ bền và tính thẩm mỹ lâu dài cho không gian của khách hàng.
            </p>
            <p>
              <strong>Cam kết về tính thẩm mỹ và độ bền lâu dài:</strong> Tường Nhà Đẹp cam kết mang đến những không gian đẹp mắt, 
              sang trọng với độ bền vượt trội theo thời gian. Chúng tôi không chỉ thi công mà còn đồng hành cùng khách hàng trong 
              việc bảo trì và chăm sóc công trình sau khi hoàn thiện.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
