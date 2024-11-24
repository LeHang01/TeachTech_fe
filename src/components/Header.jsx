import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra LocalStorage khi component được render
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setIsLoggedIn(true);
      setIsTeacher(userData.is_teacher); // Lấy giá trị is_teacher
      setFullName(userData.full_name); // Lấy full_name từ LocalStorage
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Xóa LocalStorage
    localStorage.clear();
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    navigate('/login'); // Chuyển hướng về trang login
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0">
      <Link to="/" className="navbar-brand">
        <h1 className="m-0 text-primary">
          <i className="fa fa-book-reader me-3"></i>TeachTech
        </h1>
      </Link>
      <button
        type="button"
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav mx-auto">
          {isLoggedIn ? (
            isTeacher ? (
              <>
                <Link to="/classes" className="nav-item nav-link">
                  Classes
                </Link>
                <Link to="/schedule" className="nav-item nav-link">
                  Schedule
                </Link>
                <Link to="/materials" className="nav-item nav-link">
                  Documents
                </Link>
              </>
            ) : (
              <>
                <Link to="/schedule" className="nav-item nav-link">
                  Schedule
                </Link>
                <Link to="/attendance" className="nav-item nav-link">
                  Attendance
                </Link>
                <Link to="/classes" className="nav-item nav-link">
                  Grades
                </Link>
              </>
            )
          ) : (
            <>
              <Link to="/" className="nav-item nav-link active">
                Home
              </Link>
              <Link to="/about" className="nav-item nav-link">
                About Us
              </Link>
            </>
          )}
        </div>
        <div className="d-flex align-items-center">
          {isLoggedIn && <span className="me-3 text-primary fw-bold">Hello, {fullName}</span>}
          {isLoggedIn ? (
            <button
              className="btn btn-primary rounded-pill px-3 d-none d-lg-block"
              onClick={handleLogout}
            >
              Logout<i className="fa fa-arrow-right ms-3"></i>
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary rounded-pill px-3 d-none d-lg-block">
              Log in<i className="fa fa-arrow-right ms-3"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
