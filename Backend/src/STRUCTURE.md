# Cấu Trúc Backend - Feature-Based Architecture

## Tổng Quan

Backend được tổ chức theo mô hình **Feature-Based Architecture**, phù hợp cho các dự án lớn với khả năng mở rộng cao.

## Cấu Trúc Thư Mục

```
src/
├── core/                    # Core infrastructure
│   ├── config/              # Core configuration
│   │   ├── database.js      # Database connection
│   │   ├── env.js           # Environment variables
│   │   └── cors.js          # CORS configuration
│   └── middleware/          # Core middleware
│       ├── asyncHandler.js  # Async error wrapper
│       ├── auth.middleware.js # Auth middleware
│       ├── errorHandler.js   # Error handling
│       └── uploadMiddleware.js # File upload
│
├── features/                # Feature modules (domain-driven)
│   ├── admin/               # Admin feature
│   │   ├── models/          # Admin models
│   │   │   └── Admin.js
│   │   ├── services/        # Business logic
│   │   │   └── auth.service.js
│   │   ├── controllers/     # Request handlers
│   │   │   └── auth.controller.js
│   │   └── routes/          # Route definitions
│   │       ├── auth.routes.js
│   │       └── index.js
│   │
│   ├── images/              # Image feature
│   │   ├── models/          # Image models
│   │   │   └── InteriorImage.js
│   │   ├── services/        # Business logic
│   │   │   └── image.service.js
│   │   ├── controllers/     # Request handlers
│   │   │   ├── image.controller.js (public)
│   │   │   └── adminImage.controller.js (admin)
│   │   └── routes/          # Route definitions
│   │       ├── image.routes.js (public)
│   │       └── adminImage.routes.js (admin)
│   │
│   ├── stone-types/          # Stone types feature
│   │   └── ...
│   │
│   └── search/              # Search feature
│       └── ...
│
├── shared/                   # Shared code across features
│   ├── constants/           # Shared constants
│   │   └── index.js
│   ├── utils/               # Shared utilities
│   │   ├── errors/          # Error classes
│   │   │   └── AppError.js
│   │   ├── response.js      # Response helpers
│   │   └── fileHelper.js    # File operations
│   └── ...
│
└── ... (legacy files for backward compatibility)
```

## Nguyên Tắc Tổ Chức

### 1. **Core** - Infrastructure Layer
- Chứa các thành phần cốt lõi của ứng dụng
- Database, config, core middleware
- Không chứa business logic

### 2. **Features** - Domain Modules
- Mỗi feature là một module độc lập
- Có thể chứa: models, services, controllers, routes
- Tự quản lý business logic riêng
- Có thể import từ shared nhưng không import từ feature khác

### 3. **Shared** - Common Code
- Code được sử dụng bởi nhiều features
- Constants, utilities, error classes
- Không chứa business logic cụ thể

## Service Layer Pattern

Mỗi feature có **Service Layer** để tách biệt business logic khỏi controllers:

```
Controller → Service → Model
```

- **Controller**: Xử lý HTTP request/response, validation input
- **Service**: Chứa business logic, xử lý dữ liệu
- **Model**: Định nghĩa schema và database operations

## Lợi Ích

1. **Separation of Concerns**: Business logic tách biệt khỏi HTTP layer
2. **Testability**: Services có thể test độc lập
3. **Reusability**: Services có thể được sử dụng bởi nhiều controllers
4. **Maintainability**: Code được tổ chức rõ ràng, dễ bảo trì
5. **Scalability**: Dễ dàng thêm features mới

## Migration Notes

- Các file cũ vẫn tồn tại để đảm bảo backward compatibility
- Cần cập nhật imports dần dần
- Ưu tiên sử dụng cấu trúc mới cho code mới
