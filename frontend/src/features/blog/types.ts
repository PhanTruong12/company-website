export interface BlogPost {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  coverImage?: string;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
