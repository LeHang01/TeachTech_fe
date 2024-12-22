// StudentLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default StudentLayout;
