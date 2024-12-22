import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import biểu tượng

const LoginForm = () => {
  const storedUsername = localStorage.getItem('username') || '';
  const storedPassword = localStorage.getItem('password') || '';
  const [formData, setFormData] = useState({
    username: storedUsername,
    password: storedPassword,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);

      const { username, id, is_teacher, full_name } = loginResponse.data;
      localStorage.setItem('user', JSON.stringify({ username, id, is_teacher, full_name }));

      if (is_teacher) {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
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
            <div className="col-lg-6">
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
                      <div className="form-floating position-relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control border-0"
                          id="password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                        {/* Nút toggle password */}
                        <span
                          className="position-absolute end-0 top-50 translate-middle-y me-3"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </span>
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
              className="col-lg-6"
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
