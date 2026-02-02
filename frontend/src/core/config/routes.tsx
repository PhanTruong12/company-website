// core/config/routes.tsx - Route configuration for the application
import type { ReactElement } from 'react';
import About from '../../pages/About';
import Services from '../../pages/Services';
import Contact from '../../pages/Contact';
import CollectionRedirect from '../../pages/CollectionRedirect';
import Showroom from '../../pages/Showroom';
import { ShowroomDetail } from '../../pages/ShowroomDetail';
import { Visualizer } from '../../features/visualizer/pages/Visualizer';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminImages from '../../pages/admin/AdminImages';
import { AdminGuard } from '../../shared/components/admin/AdminGuard';
import { HomeWithCollection } from '../../shared/components/HomeWithCollection';

export interface RouteConfig {
  path: string;
  element: ReactElement;
  type?: 'public' | 'admin';
}

export const publicRoutes: RouteConfig[] = [
  { path: '/', element: <HomeWithCollection />, type: 'public' },
  { path: '/about', element: <About />, type: 'public' },
  { path: '/services', element: <Services />, type: 'public' },
  { path: '/contact', element: <Contact />, type: 'public' },
  { path: '/collection/:collectionId', element: <CollectionRedirect />, type: 'public' },
  { path: '/showroom', element: <Showroom />, type: 'public' },
  { path: '/showroom/:slug', element: <ShowroomDetail />, type: 'public' },
  { path: '/visualizer', element: <Visualizer />, type: 'public' },
];

export const adminRoutes: RouteConfig[] = [
  {
    path: '/admin/interior-images',
    element: (
      <AdminGuard>
        <AdminImages />
      </AdminGuard>
    ),
    type: 'admin',
  },
  { path: '/internal/admin/login', element: <AdminLogin />, type: 'admin' },
  {
    path: '/internal/admin/images',
    element: (
      <AdminGuard>
        <AdminImages />
      </AdminGuard>
    ),
    type: 'admin',
  },
];

export const allRoutes: RouteConfig[] = [...publicRoutes, ...adminRoutes];
