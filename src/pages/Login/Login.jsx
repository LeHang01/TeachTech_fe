import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast từ react-toastify

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate(); // useNavigate to handle navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập lên backend
      const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);

      // Lưu thông tin người dùng vào localStorage
      const { username, id, is_teacher, full_name } = loginResponse.data;
      localStorage.setItem('user', JSON.stringify({ username, id, is_teacher, full_name }));

      // Chuyển hướng người dùng đến trang tương ứng với is_teacher
      if (is_teacher) {
        navigate('/teacher-dashboard'); // Điều hướng đến trang giáo viên
      } else {
        navigate('/student-dashboard'); // Điều hướng đến trang học viên
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      toast.error('Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="bg-light rounded">
          <div className="row g-0">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="h-100 d-flex flex-column justify-content-center p-5">
                <h1 className="mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control border-0"
                          id="username"
                          placeholder="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                        <label htmlFor="username">Username</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control border-0"
                          id="password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="col-lg-6 wow fadeIn"
              data-wow-delay="0.5s"
              style={{ minHeight: '400px' }}
            >
              <div className="position-relative h-100">
                <img
                  className="position-absolute w-100 h-100 rounded"
                  src="img/appointment.jpg"
                  alt="login"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
