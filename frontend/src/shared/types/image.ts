// shared/types/image.ts - Image domain types
export interface InteriorImage {
  _id: string;
  name: string;
  stoneType: string[] | string | null;
  be_mat?: string[] | string | null;
  hang_muc?: string | null;
  wallPosition: string[];
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  cloudinaryPublicId?: string | null;
}

/** Payload socket/BroadcastChannel khi CRUD ảnh (đồng bộ realtime) */
export type ImagesUpdatedPayload =
  | { action: 'created'; image: InteriorImage; imageId: string; ts: number }
  | { action: 'updated'; image: InteriorImage; imageId: string; ts: number }
  | { action: 'deleted'; imageId: string; ts: number }
  | { action: 'sync'; ts: number };
