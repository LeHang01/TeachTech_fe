import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentId = localStorage.getItem('paymentId');

    if (!paymentId) {
      navigate('/'); // Nếu không có paymentId, điều hướng về trang chính
      return;
    }

    const fetchUserInfo = async () => {
      try {
        // Gọi API để lấy thông tin người dùng dựa trên paymentId
        const response = await axios.get(
          `http://127.0.0.1:8000/api/payments/${paymentId}/user_info/`,
        );
        setUserInfo(response.data); // Lưu thông tin người dùng vào state
      } catch (error) {
        setError('Không thể tải thông tin người dùng.');
        console.error(error);
      } finally {
        setLoading(false); // Đảm bảo loading được tắt
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1>Chúc mừng bạn đã đăng ký thành công!</h1>
      {userInfo ? (
        <>
          <p>
            <strong>Thông tin tài khoản:</strong>
          </p>
          <ul>
            <li>
              <strong>Username:</strong> {userInfo.username}
            </li>
            <li>
              <strong>Password:</strong> {userInfo.password}
            </li>
          </ul>
        </>
      ) : (
        <p>Không có thông tin người dùng.</p>
      )}
    </div>
  );
};

export default RegistrationSuccess;
