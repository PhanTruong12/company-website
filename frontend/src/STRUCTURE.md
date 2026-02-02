# Cấu Trúc Dự Án - Feature-Based Architecture

## Tổng Quan

Dự án được tổ chức theo mô hình **Feature-Based Architecture**, phù hợp cho các dự án lớn với khả năng mở rộng cao.

## Cấu Trúc Thư Mục

```
src/
├── core/                    # Core infrastructure
│   ├── api/                 # API client configuration
│   │   └── client.ts       # Centralized API clients (public & admin)
│   └── config/              # Core configuration
│       └── routes.tsx      # Route definitions
│
├── features/                # Feature modules (domain-driven)
│   ├── admin/               # Admin feature
│   │   ├── api/            # Admin API calls
│   │   │   ├── auth.api.ts
│   │   │   └── images.api.ts
│   │   ├── lib/            # Admin utilities
│   │   │   └── auth.ts     # Auth service
│   │   └── components/     # Admin-specific components
│   │
│   ├── showroom/            # Showroom feature
│   │   ├── api/            # Showroom API calls
│   │   │   ├── images.api.ts
│   │   │   └── stone.api.ts
│   │   └── hooks/          # Showroom hooks
│   │       ├── useStoneTypes.ts
│   │       └── useWallPositions.ts
│   │
│   ├── visualizer/          # 3D Visualizer feature
│   │   ├── components/    # Visualizer components
│   │   │   └── MaterialPanel.tsx
│   │   ├── engine/         # Babylon.js engine
│   │   │   ├── createEngine.ts
│   │   │   ├── createScene.ts
│   │   │   └── registerSurfaces.ts
│   │   ├── materials/     # Material management
│   │   │   ├── applyGranite.ts
│   │   │   └── graniteCatalog.json
│   │   ├── pages/          # Visualizer pages
│   │   │   └── Visualizer.tsx
│   │   └── store/          # Visualizer state
│   │       └── visualStore.ts
│   │
│   └── search/              # Search feature
│       ├── api/            # Search API
│       │   └── search.api.ts
│       └── hooks/          # Search hooks
│           └── useStoneSearch.ts
│
├── shared/                   # Shared code across features
│   ├── components/          # Shared components
│   │   ├── admin/          # Admin shared components
│   │   │   └── AdminGuard.tsx
│   │   └── HomeWithCollection.tsx
│   ├── constants/           # Shared constants
│   │   ├── routes.ts       # Route constants
│   │   └── index.ts
│   ├── hooks/              # Shared hooks
│   │   └── useDebounce.ts
│   ├── types/              # Shared TypeScript types
│   │   ├── api.ts          # API types
│   │   ├── admin.ts        # Admin types
│   │   ├── image.ts        # Image types
│   │   ├── stone.ts        # Stone types
│   │   ├── visualizer.ts   # Visualizer types
│   │   └── index.ts        # Type exports
│   └── utils/              # Shared utilities
│       ├── imageUrl.ts
│       └── suppressConsoleWarnings.ts
│
├── components/              # Legacy/global components
│   ├── header/             # Header components
│   ├── Footer.tsx
│   └── ...
│
├── pages/                   # Page components
│   ├── admin/              # Admin pages
│   ├── About.tsx
│   ├── Contact.tsx
│   └── ...
│
└── ...
```

## Nguyên Tắc Tổ Chức

### 1. **Core** - Infrastructure Layer
- Chứa các thành phần cốt lõi của ứng dụng
- API clients, routing configuration
- Không chứa business logic

### 2. **Features** - Domain Modules
- Mỗi feature là một module độc lập
- Có thể chứa: API, components, hooks, store, pages
- Tự quản lý state và logic riêng
- Có thể import từ shared nhưng không import từ feature khác

### 3. **Shared** - Common Code
- Code được sử dụng bởi nhiều features
- Types, constants, utilities, shared components
- Không chứa business logic cụ thể

## Quy Tắc Import

### ✅ Được Phép
```typescript
// Feature import từ shared
import { useDebounce } from '../../../shared/hooks/useDebounce';
import type { InteriorImage } from '../../../shared/types';

// Feature import từ core
import { apiClient } from '../../../core/api/client';

// Component import từ feature
import { MaterialPanel } from '../components/MaterialPanel';
```

### ❌ Không Được Phép
```typescript
// Feature import từ feature khác (tránh circular dependencies)
import { useStoneTypes } from '../../showroom/hooks/useStoneTypes'; // ❌

// Shared import từ feature
import { useVisualStore } from '../../features/visualizer/store'; // ❌
```

## Lợi Ích

1. **Scalability**: Dễ dàng thêm features mới
2. **Maintainability**: Code được tổ chức rõ ràng, dễ bảo trì
3. **Testability**: Mỗi feature có thể test độc lập
4. **Team Collaboration**: Nhiều team có thể làm việc song song trên các features khác nhau
5. **Code Reusability**: Shared code được tái sử dụng hiệu quả

## Migration Notes

- Các file cũ vẫn tồn tại để đảm bảo backward compatibility
- Cần cập nhật imports dần dần
- Ưu tiên sử dụng cấu trúc mới cho code mới
