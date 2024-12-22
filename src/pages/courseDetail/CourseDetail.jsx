import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Để lấy ID từ URL
import { useNavigate } from 'react-router-dom';
const CourseDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    phone_number: '',
    address: '',
  });

  // Hàm lấy chi tiết khóa học từ API
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`);
        setCourse(response.data); // Lưu dữ liệu khóa học vào state
      } catch (err) {
        setError('Lỗi khi tải chi tiết khóa học');
      } finally {
        setLoading(false); // Hoàn thành tải
      }
    };

    fetchCourseDetail();
  }, [id]); // Chạy lại khi ID thay đổi

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  // Hàm mở/đóng popup
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Hàm xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu thanh toán lên backend để lưu thông tin thanh toán
      const paymentResponse = await axios.post('http://127.0.0.1:8000/api/payments/', {
        ...formData,
        course: id,
      });
      console.log('Thanh toán đã được lưu thành công:', paymentResponse);
      const paymentId = paymentResponse.data.id;
      localStorage.setItem('paymentId', paymentId);

      // Gọi API để tạo đơn hàng ZaloPay
      const orderResponse = await axios.post('http://127.0.0.1:8000/api/zalopay/create-order/', {
        paymentId: paymentResponse.data.id,
      });
      console.log('Đơn hàng ZaloPay được tạo thành công:', orderResponse);

      // Mở trang thanh toán ZaloPay trong tab mới
      const orderUrl = orderResponse.data.order_url;
      window.open(orderUrl, '_blank');
    } catch (error) {
      console.error('Lỗi khi thanh toán hoặc gọi ZaloPay:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  return (
    <div className="container-xxl py-5" style={{ marginLeft: '50px' }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Bên trái: Tên khóa học, mô tả và nút đăng ký */}
          <div
            className="col-lg-6 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              backgroundColor: '#fff', // Màu nền trắng
              borderRadius: '15px', // Bo tròn các góc
              padding: '20px', // Thêm khoảng cách giữa nội dung và viền
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ nhẹ
            }}
          >
            <h1 className="mb-4">{course.course_name}</h1>
            <p>{course.description}</p>
            {/* Nút Mua ngay */}
            <a
              className="btn btn-primary rounded-pill py-3 px-5"
              href="#"
              style={{ width: '530px' }}
              onClick={togglePopup}
            >
              Mua ngay
            </a>

            {/* Popup */}
            {showPopup && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <h2>Thông tin thanh toán</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="fullName">Họ và tên</label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="birthDate">Ngày sinh</label>
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Giới tính</label>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="Nam"
                          onChange={handleInputChange}
                          required
                          className="form-check-input"
                        />
                        <label htmlFor="male" className="form-check-label">
                          Nam
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="Nữ"
                          onChange={handleInputChange}
                          required
                          className="form-check-input"
                        />
                        <label htmlFor="female" className="form-check-label">
                          Nữ
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">Số điện thoại</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Địa chỉ</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Hiển thị giá khóa học */}
                    <div className="form-group">
                      <label>Giá khóa học:</label>
                      <p>{course.price} VND</p>
                    </div>

                    <div className="popup-buttons">
                      <button type="button" className="btn btn-secondary" onClick={togglePopup}>
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Thanh toán
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Bên phải: Thông tin giáo viên */}
          <div className="col-lg-4 col-md-6 wow fadeInUp container-xxl py-5" data-wow-delay="0.5s">
            <div className="row g-4">
              <div className="team-item position-relative w-full">
                <img
                  className="img-fluid rounded-circle "
                  src={course.teacher.profile_picture ||''} // Hình ảnh giáo viên từ API
                  alt={course.teacher.name}
                  style={{ height: '500px', width: '100%' }}
                />
                <div className="team-text">
                  <h3>{course.teacher.name}</h3>
                  <p>{course.teacher.qualifications}</p>
                  <div className="d-flex align-items-center">
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết khác (Video, giá, thời gian...) */}
        <div className="row mt-5">
          <div className="col-md-6">
            <p>
              <strong>Price:</strong> {course.price} $
            </p>
            <p>
              <strong>Start Date:</strong> {course.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {course.end_date}
            </p>
            <p>
              <strong>Time:</strong> {course.time}
            </p>
            <p>
              <strong>Category:</strong> {course.category.name}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Video:</strong>
            </p>
            <a href={course.course_video} target="_blank" rel="noopener noreferrer">
              Xem video khóa học
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
