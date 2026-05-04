export type StoneCollectionItem = {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  alt: string;
  width: number;
  height: number;
};

export type StoneCollectionCategory = {
  id: string;
  name: string;
  description: string;
  stoneTypeFilters: string[];
  wallPositionFilters: string[];
  /**
   * `_id` MongoDB của ảnh nội thất — đưa lên đầu carousel theo đúng thứ tự mảng.
   * Chỉ áp dụng khi ảnh đó vẫn nằm trong danh sách sau khi lọc.
   * Lấy `_id` từ trang quản trị ảnh hoặc API.
   */
  carouselLeadImageIds?: string[];
  /**
   * Khớp `name` của ảnh (không phân biệt hoa thường) — đưa một ảnh lên đầu sau `carouselLeadImageUrlContains`.
   */
  carouselLeadImageName?: string;
  /**
   * Chuỗi con nằm trong `imageUrl` (vd. `interior-…jpg` từ Cloudinary) — ghim ảnh đó lên đầu sau `carouselLeadImageIds`.
   */
  carouselLeadImageUrlContains?: string;
  /**
   * Ảnh có URL chứa chuỗi này bị đưa **xuống cuối** (trước bước `carouselLeadImageName`) — để tránh ảnh không mong muốn đứng đầu.
   */
  carouselDemoteImageUrlContains?: string;
};

/**
 * Đưa các ảnh có `id` nằm trong `leadIds` lên đầu danh sách (giữ thứ tự trong `leadIds`).
 */
export function orderCarouselItemsWithLeadIds<T extends { id: string }>(
  items: T[],
  leadIds?: readonly string[] | null
): T[] {
  if (!leadIds?.length) return items;

  const trimmed = leadIds.map((id) => id.trim()).filter(Boolean);
  if (trimmed.length === 0) return items;

  const byId = new Map(items.map((item) => [item.id, item]));
  const leads: T[] = [];
  const used = new Set<string>();

  for (const id of trimmed) {
    const item = byId.get(id);
    if (item && !used.has(id)) {
      leads.push(item);
      used.add(id);
    }
  }

  if (leads.length === 0) return items;

  const rest = items.filter((item) => !used.has(item.id));
  return [...leads, ...rest];
}

const normalizeCarouselTitle = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFC')
    .toLocaleLowerCase('vi');

/**
 * Đưa ảnh có `title` khớp `leadImageName` lên vị trí đầu (khớp đầy đủ hoặc chuỗi con sau khi chuẩn hóa).
 */
export function moveCarouselLeadByName<T extends { title: string }>(
  items: T[],
  leadImageName?: string | null
): T[] {
  const raw = leadImageName?.trim();
  if (!raw || raw.length < 2) return items;

  const needle = normalizeCarouselTitle(raw);
  const idx = items.findIndex((item) => {
    const t = normalizeCarouselTitle(item.title);
    return t === needle || t.includes(needle);
  });
  if (idx <= 0) return items;

  const next = [...items];
  const [lead] = next.splice(idx, 1);
  return [lead, ...next];
}

/**
 * Đưa ảnh có `imageUrl` chứa `urlPart` lên đầu (khớp storage path / public id).
 */
export function moveCarouselLeadByUrlPart<T extends { imageUrl: string }>(
  items: T[],
  urlPart?: string | null
): T[] {
  const part = urlPart?.trim();
  if (!part || part.length < 4) return items;

  const lower = part.toLowerCase();
  const idx = items.findIndex((item) => item.imageUrl.toLowerCase().includes(lower));
  if (idx <= 0) return items;

  const next = [...items];
  const [lead] = next.splice(idx, 1);
  return [lead, ...next];
}

/**
 * Đưa ảnh có `imageUrl` khớp xuống **cuối** danh sách (không xóa khỏi carousel).
 */
export function demoteCarouselByUrlPart<T extends { imageUrl: string }>(
  items: T[],
  urlPart?: string | null
): T[] {
  const part = urlPart?.trim();
  if (!part || part.length < 4) return items;

  const lower = part.toLowerCase();
  const head: T[] = [];
  const tail: T[] = [];
  for (const item of items) {
    if (item.imageUrl.toLowerCase().includes(lower)) {
      tail.push(item);
    } else {
      head.push(item);
    }
  }
  if (tail.length === 0) return items;
  return [...head, ...tail];
}

/** Thứ tự: ids → ghim URL → hạ URL không mong muốn → ghim theo tên. */
export function orderCarouselCategoryItems<T extends { id: string; title: string; imageUrl: string }>(
  items: T[],
  category: Pick<
    StoneCollectionCategory,
    | 'carouselLeadImageIds'
    | 'carouselLeadImageName'
    | 'carouselLeadImageUrlContains'
    | 'carouselDemoteImageUrlContains'
  >
): T[] {
  let out = orderCarouselItemsWithLeadIds(items, category.carouselLeadImageIds);
  out = moveCarouselLeadByUrlPart(out, category.carouselLeadImageUrlContains);
  out = demoteCarouselByUrlPart(out, category.carouselDemoteImageUrlContains);
  out = moveCarouselLeadByName(out, category.carouselLeadImageName);
  return out;
}

export const stoneCollectionCategories: StoneCollectionCategory[] = [
  {
    id: 'sintered-stone-kitchen',
    name: 'Đá Nung Kết - Bếp',
    description: 'Các mẫu đá nung kết dùng cho mặt bếp, đảo bếp và các hạng mục bếp.',
    stoneTypeFilters: ['Nung Kết'],
    wallPositionFilters: ['Mặt bếp', 'Bàn đảo'],
    carouselDemoteImageUrlContains: 'interior-1776648659347-732018962',
    carouselLeadImageName: 'Bếp và Bàn Đảo 8',
  },
  {
    id: 'sintered-stone-stairs',
    name: 'Đá Nung Kết - Cầu Thang',
    description: 'Mẫu đá nung kết ứng dụng cho bậc cầu thang và khu vực lối đi.',
    stoneTypeFilters: ['Nung Kết'],
    wallPositionFilters: ['Cầu thang'],
    carouselLeadImageName: 'Cầu Thang 24',
  },
  {
    id: 'quartz-kitchen',
    name: 'Đá Thạch Anh - Bếp',
    description: 'Mẫu đá thạch anh cho mặt bếp hiện đại, sạch và dễ bảo dưỡng.',
    stoneTypeFilters: ['Thạch Anh'],
    wallPositionFilters: ['Mặt bếp', 'Bàn đảo'],
  },
  {
    id: 'quartz-stairs',
    name: 'Đá Thạch Anh - Cầu Thang',
    description: 'Mẫu đá thạch anh dùng cho cầu thang và hạng mục nội thất cần thẩm mỹ đồng đều.',
    stoneTypeFilters: ['Thạch Anh'],
    wallPositionFilters: ['Cầu thang'],
  },
  {
    id: 'natural-stone',
    name: 'Đá Tự Nhiên',
    description: 'Các mẫu đá tự nhiên với vân đá độc bản, phù hợp nhiều không gian nội thất.',
    stoneTypeFilters: ['Tự Nhiên', 'Granite', 'Marble'],
    wallPositionFilters: [],
  },
  {
    id: 'solid-surface',
    name: 'Solid Surface',
    description: 'Mẫu Solid Surface cho lavabo, quầy, bếp và nội thất hiện đại.',
    stoneTypeFilters: ['Solid Surface'],
    wallPositionFilters: [],
  },
];
