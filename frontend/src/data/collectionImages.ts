import { publicAsset } from '../utils/publicAsset';

/**
 * Dữ liệu hình ảnh cho các bộ sưu tập
 * Phân loại hình ảnh theo:
 * - Collection: thach-anh, nung-ket, tu-nhien
 * - Category: cau-thang (Cầu Thang), bep (Bếp)
 * 
 * HƯỚNG DẪN PHÂN LOẠI:
 * - Hình cầu thang: Các hình ảnh về cầu thang, bậc thang, lan can
 * - Hình bếp: Các hình ảnh về mặt bếp, đảo bếp, tủ bếp
 * 
 * Thay thế các đường dẫn '/gallery1.jpg' bằng đường dẫn hình ảnh thực tế
 * và đảm bảo phân loại đúng category
 */

export interface CollectionImages {
  [collectionId: string]: {
    [category: string]: string[];
  };
}

const asset = (name: string) => publicAsset(name);

export const collectionImages: CollectionImages = {
  'thach-anh': {
    'cau-thang': [
      // THAY THẾ: Đặt các hình ảnh CẦU THANG ở đây
      // Ví dụ: '/images/thach-anh/cau-thang-1.jpg'
      asset('gallery1.jpg'),  // TODO: Thay bằng hình cầu thang thực tế
      asset('gallery2.jpg'),  // TODO: Thay bằng hình cầu thang thực tế
      asset('gallery3.jpg'),  // TODO: Thay bằng hình cầu thang thực tế
      asset('collection.jpg'), // TODO: Thay bằng hình cầu thang thực tế
    ],
    'bep': [
      // THAY THẾ: Đặt các hình ảnh BẾP ở đây
      // Ví dụ: '/images/thach-anh/bep-1.jpg'
      asset('collection2.jpg'), // TODO: Thay bằng hình bếp thực tế
      asset('collection3.jpg'), // TODO: Thay bằng hình bếp thực tế
      asset('gallery1.jpg'),    // TODO: Thay bằng hình bếp thực tế
      asset('gallery2.jpg'),    // TODO: Thay bằng hình bếp thực tế
    ],
  },
  'nung-ket': {
    'cau-thang': [
      // Hình ảnh cầu thang đá nung kết
      asset('gallery1.jpg'),
      asset('gallery2.jpg'),
      asset('gallery3.jpg'),
      asset('collection.jpg'),
    ],
    'bep': [
      // Hình ảnh bếp đá nung kết
      asset('collection2.jpg'),
      asset('collection3.jpg'),
      asset('gallery1.jpg'),
      asset('gallery2.jpg'),
    ],
  },
  'tu-nhien': {
    'cau-thang': [
      // Hình ảnh cầu thang đá tự nhiên
      asset('gallery1.jpg'),
      asset('gallery2.jpg'),
      asset('gallery3.jpg'),
      asset('collection.jpg'),
    ],
    'bep': [
      // Hình ảnh bếp đá tự nhiên
      asset('collection2.jpg'),
      asset('collection3.jpg'),
      asset('gallery1.jpg'),
      asset('gallery2.jpg'),
    ],
  },
};

/**
 * Helper function để lấy hình ảnh theo collection và category
 */
export const getImagesByCollectionAndCategory = (
  collectionId: string,
  category: string
): string[] => {
  return collectionImages[collectionId]?.[category] || [];
};









