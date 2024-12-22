import React from 'react';
import Header from '../components//Header';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TeacherLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div>
      <ToastContainer />
        {children}
        </div>
      <Footer />
    </div>
  );
};

export default TeacherLayout;
