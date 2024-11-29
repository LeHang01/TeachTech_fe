import MainLayout from './layouts/Mainlayout';

import About from './pages/about/About';
import Home from './pages/home/Home';
import CourseDetail from './pages/courseDetail/CourseDetail';
import RegistrationSuccess from './pages/RegistrationSuccess/RegistrationSuccess';
import CameraCapture from './pages/Camera/CameraCapture';
import LoginForm from './pages/Login/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import VerifyImage from './pages/Camera/VerifyCapture';
import Schedule from './pages/schedule/schedule';
import LopHocTrucTuyen from './pages/class/class';
import classes from './pages/classes/classes';
import UploadDocuments from './pages/documents/documents';

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
  {
    path: '/attendance', // Route động cho chi tiết khóa học
    component: VerifyImage,
    layout: MainLayout,
  },
  {
    path: '/login', // Route động cho chi tiết khóa học
    component: LoginForm,
    layout: MainLayout,
  },
  {
    path: '/teacher-dashboard', // Route cho giáo viên
    component: TeacherDashboard,
    layout: TeacherLayout, // Layout dành cho giáo viên
  },
  {
    path: '/student-dashboard', // Route cho học viên
    component: StudentDashboard,
    layout: StudentLayout, // Layout dành cho học viên
  },
  {
    path: '/schedule', // Route cho học viên
    component: Schedule,
    layout: StudentLayout, // Layout dành cho học viên
  },
  {
    path: '/class', // Route cho học viên
    component: LopHocTrucTuyen,
    layout: StudentLayout, // Layout dành cho học viên
  },
  {
    path: '/classes', // Route cho học viên
    component: classes,
    layout: TeacherLayout, // Layout dành cho học viên
  },
  {
    path: '/documents', // Route cho học viên
    component: UploadDocuments,
    layout: TeacherLayout, // Layout dành cho học viên
  },
];
