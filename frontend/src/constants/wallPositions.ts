// wallPositions.ts - Danh sách các vị trí ốp trong nhà và ngoài nhà
export const WALL_POSITIONS = [
  // Vị trí trong nhà
  'Phòng khách',
  'Phòng bếp',
  'Phòng tắm',
  'Hành lang',
  'Phòng ngủ',
  'Cầu thang',
  'Ban công',
  'Sân thượng',
  'Tiền sảnh',
  'Phòng làm việc',
  'Phòng ăn',
  'Phòng thờ',
  // Vị trí ngoài nhà
  'Mặt tiền',
  'Cổng',
  'Sân vườn',
  'Lối đi',
] as const;

export type WallPositionType = typeof WALL_POSITIONS[number];

