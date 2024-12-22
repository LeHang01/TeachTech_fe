import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
  return (
    <div className="relative">
      <Header />
      <main>{children}</main>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default MainLayout;
