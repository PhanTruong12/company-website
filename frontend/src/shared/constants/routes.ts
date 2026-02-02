// shared/constants/routes.ts - Route path constants
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  SHOWROOM: '/showroom',
  SHOWROOM_DETAIL: (slug: string) => `/showroom/${slug}`,
  COLLECTION: (id: string) => `/collection/${id}`,
  VISUALIZER: '/visualizer',
  ADMIN: {
    LOGIN: '/internal/admin/login',
    IMAGES: '/internal/admin/images',
    INTERIOR_IMAGES: '/admin/interior-images',
  },
} as const;

export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/internal/admin') || pathname.startsWith('/admin/');
};
