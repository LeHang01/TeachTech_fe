import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFaceScanCompleted, setIsFaceScanCompleted] = useState(false); // Trạng thái quét khuôn mặt

  useEffect(() => {
    const paymentId = localStorage.getItem('paymentId');
    if (!paymentId) {
      navigate('/'); // Nếu không có paymentId, điều hướng về trang chính
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/payments/${paymentId}/user_info/`,
        );
        setUserInfo(response.data);
        console.log(response.data);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('password', response.data.password);
      } catch (error) {
        setError('Không thể tải thông tin người dùng.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    // Kiểm tra trạng thái quét khuôn mặt từ localStorage
    const faceScanStatus = localStorage.getItem('faceScanCompleted');
    setIsFaceScanCompleted(faceScanStatus === 'true');
  }, [navigate]);

  const handleFaceScan = () => {
    navigate('/face-scan'); // Điều hướng đến trang quét khuôn mặt
  };

  const handleLoginClick = () => {
    // Logic xử lý đăng nhập
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Chúc mừng bạn đã đăng ký thành công!</h1>
        {isFaceScanCompleted ? (
          userInfo ? (
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
              <button
                className="login-button"
                onClick={handleLoginClick}
                style={{
                  backgroundColor: '#FE5D37',
                  color: 'white',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  borderRadius: '8px',
                  padding: '10px 20px',
                }}
              >
                Đăng nhập
              </button>
            </>
          ) : (
            <p>Không có thông tin người dùng.</p>
          )
        ) : (
          <>
            <p>Bạn cần hoàn tất quét khuôn mặt để đăng kí khuôn mặt.</p>
            <button
              className="scan-button"
              onClick={handleFaceScan}
              style={{
                backgroundColor: '#FE5D37',
                color: 'white',
                fontWeight: 'bold',
                border: '2px solid white',
                borderRadius: '8px',
                padding: '10px 20px',
              }}
            >
              Quét khuôn mặt
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationSuccess;
