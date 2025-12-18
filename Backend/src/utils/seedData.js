// seedData.js - Khởi tạo dữ liệu mẫu
const StoneType = require('../models/StoneType');
const InteriorType = require('../models/InteriorType');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs'); // Chỉ dùng để test password, không dùng để hash trong seed

const seedStoneTypes = async () => {
  try {
    const stoneTypes = [
      {
        name: 'Thạch Anh',
        slug: 'thach-anh',
        nameEn: 'Quartz',
        description: 'Đá thạch anh nhân tạo với độ bền cao và nhiều màu sắc đa dạng'
      },
      {
        name: 'Nung Kết',
        slug: 'nung-ket',
        nameEn: 'Sintered Stone',
        description: 'Đá nung kết công nghệ cao, chống thấm và chống trầy xước tuyệt vời'
      },
      {
        name: 'Tự Nhiên',
        slug: 'tu-nhien',
        nameEn: 'Natural Stone',
        description: 'Đá tự nhiên với vẻ đẹp độc đáo và sang trọng'
      }
    ];

    // Xóa dữ liệu cũ (nếu có)
    await StoneType.deleteMany({});
    
    // Thêm dữ liệu mới
    const created = await StoneType.insertMany(stoneTypes);
    console.log(`Đã tạo ${created.length} loại đá`);
    return created;
  } catch (error) {
    console.error('Lỗi khi seed StoneTypes:', error);
    throw error;
  }
};

const seedInteriorTypes = async () => {
  try {
    const interiorTypes = [
      {
        name: 'Bếp',
        nameEn: 'Kitchen',
        description: 'Ứng dụng cho không gian bếp, mặt bàn bếp'
      },
      {
        name: 'Cầu Thang',
        nameEn: 'Stairs',
        description: 'Ứng dụng cho cầu thang, bậc thang'
      },
      {
        name: 'Nền Tường-Nhà',
        nameEn: 'Floor-Wall-Home',
        description: 'Ứng dụng cho nền nhà, tường và các không gian nội thất khác'
      }
    ];

    // Xóa dữ liệu cũ (nếu có)
    await InteriorType.deleteMany({});
    
    // Thêm dữ liệu mới
    const created = await InteriorType.insertMany(interiorTypes);
    console.log(`Đã tạo ${created.length} kiểu nội thất`);
    return created;
  } catch (error) {
    console.error('Lỗi khi seed InteriorTypes:', error);
    throw error;
  }
};

const seedAdmin = async () => {
  try {
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await Admin.findOne({ email: 'admin@tndgranite.com' });
    
    if (existingAdmin) {
      console.log('Admin đã tồn tại');
      // Kiểm tra và reset password nếu cần
      const testPassword = await bcrypt.compare('admin123', existingAdmin.password);
      if (!testPassword) {
        console.log('Reset password về "admin123"...');
        existingAdmin.password = 'admin123'; // Pre-save hook sẽ tự động hash
        await existingAdmin.save();
        console.log('✅ Đã reset password');
      }
      return existingAdmin;
    }

    // Tạo admin mặc định
    // Email: admin@tndgranite.com
    // Password: admin123 (sẽ được hash tự động bởi pre-save hook)
    const admin = new Admin({
      email: 'admin@tndgranite.com',
      password: 'admin123', // Pre-save hook sẽ tự động hash
      role: 'admin'
    });

    await admin.save();

    console.log('Đã tạo tài khoản admin mặc định:');
    console.log('  Email: admin@tndgranite.com');
    console.log('  Password: admin123');
    console.log('  ⚠️  VUI LÒNG ĐỔI MẬT KHẨU SAU KHI ĐĂNG NHẬP!');
    return admin;
  } catch (error) {
    console.error('Lỗi khi seed Admin:', error);
    throw error;
  }
};

const seedAll = async () => {
  try {
    console.log('Bắt đầu seed dữ liệu...');
    await seedStoneTypes();
    await seedInteriorTypes();
    await seedAdmin();
    console.log('Hoàn thành seed dữ liệu!');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

module.exports = {
  seedStoneTypes,
  seedInteriorTypes,
  seedAdmin,
  seedAll
};

