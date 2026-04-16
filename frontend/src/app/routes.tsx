import { createBrowserRouter } from 'react-router';
import { MapView } from './pages/MapView';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MapView,
  },
  {
    path: '/auth',
    Component: AuthPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);