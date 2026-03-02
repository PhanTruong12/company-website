// wallPositions.ts - Danh sách các vị trí ốp trong nhà và ngoài nhà
export const WALL_POSITIONS = [
  // Vị trí trong nhà
  'Cầu thang',
  'Mặt bếp',
  'Bàn đảo',
  'Lavabo',
  'Ốp tường',
  'Ốp sàn',
  'Vách tivi',
  'Vách trang trí',
  'Vách ngăn',
  'Ốp cột',
  'Ốp thang máy',
  'Quầy bar',
  // Vị trí ngoài nhà
  'Mặt tiền',
  'Ốp bể bơi',
  'Đá Tấm',
] as const;

export type WallPositionType = typeof WALL_POSITIONS[number];

