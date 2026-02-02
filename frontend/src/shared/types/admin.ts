// shared/types/admin.ts - Admin domain types
export interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}
