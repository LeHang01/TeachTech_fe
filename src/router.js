import MainLayout from './layouts/Mainlayout';

import About from './pages/about/About';
import Home from './pages/home/Home';
import CourseDetail from './pages/courseDetail/CourseDetail';

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
];
