// core/config/routes.tsx - Route configuration for the application
import type { ReactElement } from 'react';
import About from '../../pages/About';
import Services from '../../pages/Services';
import Contact from '../../pages/Contact';
import Blog from '../../pages/Blog';
import BlogDetail from '../../pages/BlogDetail';
import CollectionRedirect from '../../pages/CollectionRedirect';
import Showroom from '../../pages/Showroom';
import { ShowroomDetail } from '../../pages/ShowroomDetail';
import { Visualizer } from '../../features/visualizer/pages/Visualizer';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminImages from '../../pages/admin/AdminImages';
import AdminBlogs from '../../pages/admin/AdminBlogs';
import AdminBlogEditor from '../../pages/admin/AdminBlogEditor';
import AdminTraffic from '../../pages/admin/AdminTraffic';
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
  { path: '/blog', element: <Blog />, type: 'public' },
  { path: '/blog/:id', element: <BlogDetail />, type: 'public' },
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
  {
    path: '/internal/admin/blogs',
    element: (
      <AdminGuard>
        <AdminBlogs />
      </AdminGuard>
    ),
    type: 'admin',
  },
  {
    path: '/internal/admin/blogs/new',
    element: (
      <AdminGuard>
        <AdminBlogEditor />
      </AdminGuard>
    ),
    type: 'admin',
  },
  {
    path: '/internal/admin/blogs/:id/edit',
    element: (
      <AdminGuard>
        <AdminBlogEditor />
      </AdminGuard>
    ),
    type: 'admin',
  },
  {
    path: '/internal/admin/traffic',
    element: (
      <AdminGuard>
        <AdminTraffic />
      </AdminGuard>
    ),
    type: 'admin',
  },
];

export const allRoutes: RouteConfig[] = [...publicRoutes, ...adminRoutes];
