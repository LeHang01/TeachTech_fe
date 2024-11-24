import MainLayout from './layouts/Mainlayout';

import About from './pages/about/About';
import Home from './pages/home/Home';
import CourseDetail from './pages/courseDetail/CourseDetail';
import RegistrationSuccess from './pages/RegistrationSuccess/RegistrationSuccess';
import CameraCapture from './pages/Camera/CameraCapture';
export const mainRouters = [
  {
    path: '/',
    component: Home,
    layout: MainLayout,
  },
  {
    path: '/About',
    component: About,
    layout: MainLayout,
  },
  {
    path: '/Contact',
    component: Home,
    layout: MainLayout,
  },
  {
    path: '/courses/:id', // Route động cho chi tiết khóa học
    component: CourseDetail,
    layout: MainLayout,
  },
  {
    path: '/registration-success', // Route động cho chi tiết khóa học
    component: RegistrationSuccess,
    layout: MainLayout,
  },
  {
    path: '/face-scan', // Route động cho chi tiết khóa học
    component: CameraCapture,
    layout: MainLayout,
  },
];
