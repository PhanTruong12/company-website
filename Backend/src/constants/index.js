// constants/index.js - Application constants

module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },

  ERROR_MESSAGES: {
    // Authentication
    AUTH_REQUIRED: 'Không có token xác thực. Vui lòng đăng nhập.',
    INVALID_TOKEN: 'Token không hợp lệ.',
    TOKEN_EXPIRED: 'Token đã hết hạn.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    UNAUTHORIZED_ACCESS: 'Không có quyền truy cập.',
    ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại.',

    // Validation
    REQUIRED_FIELD: (field) => `${field} là bắt buộc.`,
    INVALID_EMAIL: 'Email không hợp lệ.',
    INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự.',
    MISSING_REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
    INVALID_FILE_TYPE: 'Loại file không được hỗ trợ.',
    FILE_REQUIRED: 'Vui lòng upload file.',

    // Resources
    RESOURCE_NOT_FOUND: (resource) => `${resource} không tồn tại.`,
    RESOURCE_ALREADY_EXISTS: (resource) => `${resource} đã tồn tại.`,
    RESOURCE_CREATED: (resource) => `Tạo ${resource} thành công.`,
    RESOURCE_UPDATED: (resource) => `Cập nhật ${resource} thành công.`,
    RESOURCE_DELETED: (resource) => `Xóa ${resource} thành công.`,

    // Server
    INTERNAL_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
    DATABASE_ERROR: 'Lỗi kết nối database.',
    UPLOAD_ERROR: 'Lỗi khi upload file.'
  },

  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Đăng nhập thành công.',
    LOGOUT_SUCCESS: 'Đăng xuất thành công.',
    CREATED: (resource) => `Tạo ${resource} thành công.`,
    UPDATED: (resource) => `Cập nhật ${resource} thành công.`,
    DELETED: (resource) => `Xóa ${resource} thành công.`,
    RETRIEVED: (resource) => `Lấy ${resource} thành công.`
  },

  FILE_CONFIG: {
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    UPLOAD_DIR: 'uploads/interior-images'
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff'
  },

  JWT: {
    DEFAULT_EXPIRES_IN: '7d'
  }
};

