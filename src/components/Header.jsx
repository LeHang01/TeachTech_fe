import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pusher from 'pusher-js';
import './Header.css';
import {
  Badge,
  ListGroup,
  Button,
  OverlayTrigger,
  Popover,
  ToggleButton,
  ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [user_id, setUser_id] = useState(false);
  const [fullName, setFullName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [filterOption, setFilterOption] = useState('all'); // 'all' or 'unread'
  const [messageCount, setMessageCount] = useState(0);

  const navigate = useNavigate();
  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      setMessageCount(0);
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/notifications/${user_id}/`); // API call
      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data);
        setMessageCount(response.data.filter(notificationItem => !notificationItem.is_seen).length);
        console.log(response.data)
      }
    } catch (error) {
    }
  }, [isLoggedIn]); // Chỉ phụ thuộc vào isLoggedIn

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setIsLoggedIn(true);
      setIsTeacher(userData.is_teacher);
      setUser_id(userData.id);
      setFullName(userData.full_name);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const formatDate2 = (time) => {
    // Lấy phần ngày từ datetime chuẩn
    const date = new Date(time); // Tạo đối tượng Date từ chuỗi ISO

    const day = date.getDate(); // Lấy ngày trong tháng
    const month = date.getMonth(); // Lấy tháng (0 - 11)
    const year = date.getFullYear(); // Lấy năm

    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    return `${day} ${months[month]} ${year}`; // Trả về "05 Tháng 12 2024"
  };
  const formatTime2 = (time) => {
    // Lấy phần giờ từ datetime chuẩn
    const date = new Date(time); // Tạo đối tượng Date từ chuỗi ISO
    date.setHours(date.getHours() + 7);
    let hours = date.getHours(); // Lấy giờ (0 - 23)
    const minutes = date.getMinutes(); // Lấy phút (0 - 59)

    const period = hours < 12 ? 'AM' : 'PM'; // AM hoặc PM
    hours = hours % 12; // Chuyển sang định dạng 12 giờ
    if (hours === 0) hours = 12; // Nếu giờ là 0 thì hiển thị 12

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Thêm số 0 nếu phút nhỏ hơn 10

    return `${hours}:${formattedMinutes} ${period}`; // Trả về "2:32 AM"
  };
  const formatTime1 = (time) => {
    // Lấy phần giờ từ datetime chuẩn
    const date = new Date(time); // Tạo đối tượng Date từ chuỗi ISO
    let hours = date.getHours(); // Lấy giờ (0 - 23)
    const minutes = date.getMinutes(); // Lấy phút (0 - 59)

    const period = hours < 12 ? 'AM' : 'PM'; // AM hoặc PM
    hours = hours % 12; // Chuyển sang định dạng 12 giờ
    if (hours === 0) hours = 12; // Nếu giờ là 0 thì hiển thị 12

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Thêm số 0 nếu phút nhỏ hơn 10

    return `${hours}:${formattedMinutes} ${period}`; // Trả về "2:32 AM"
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    // Establish connection with Pusher
    const pusher = new Pusher('3c30a568c6f720f4d929', {
      cluster: 'ap1',
    });

    const channelName = `${user_id}`; // Create channel name based on user ID
    const channel = pusher.subscribe(channelName);

    // Listen for all types of events
    const handleNotification = (data) => {
      const notificationData = data;
      const type = notificationData.type; // Type of notification: "Payment" or "Meeting"

      const formattedNotification =
        type === "Payment"
          ? {
            description: notificationData.course_name,
            full_name: notificationData.full_name,
            phone_number: notificationData.phone_number,
            address: notificationData.address,
            course_name: notificationData.course_name,
            course_price: notificationData.course_price,
            teacher_name: notificationData.teacher_name,
            created_at: notificationData.created_at,
            id: notificationData._id,
            type,
          }
          : {
            description: `Cuộc họp: ${notificationData.course_name}`,
            time: notificationData.time,
            course_name: notificationData.course_name,
            teacher_name: notificationData.teacher_name,
            created_at: notificationData.created_at,
            id: notificationData._id,
            type,
          };

      setNotifications((prevNotifications) => [
        formattedNotification,
        ...prevNotifications,
      ]);

      setMessageCount((prevCount) => prevCount + 1);

      const toastMessage =
        type === "Payment" ? (
          <div className="notification-toast">
            <h4 className="toast-title">Thông báo thanh toán</h4>
            <div className="toast-content">
              <p><strong>Họ tên:</strong> {notificationData.full_name}</p>
              <p><strong>Khóa học:</strong> {notificationData.course_name}</p>
            </div>
          </div>
        ) : (
          <div className="notification-toast">
            <h4 className="toast-title">Thông báo cuộc họp</h4>
            <div className="toast-content">
              <p><strong>Khóa học:</strong> {notificationData.course_name}</p>
              <p><strong>Thời gian họp:</strong>  {formatTime1(notificationData.time)} - {formatTime1(notificationData.time)}</p>
            </div>
          </div>
        );
        console.log(notificationData)
      toast.info(toastMessage, {
        position: 'top-left',
        autoClose: 20000,
        hideProgressBar: false,
        closeButton: true,
        className: 'custom-toast',
      });
    };

    // Bind events
    channel.bind("Payment", handleNotification);
    channel.bind("Meeting", handleNotification);

    return () => {
      pusher.unsubscribe(channelName); // Unsubscribe when component unmounts
    };
  }, [user_id]);

  const handleNotificationClick = () => {
    navigate('/meeting-student');
  };



  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };
  const toggleExpand = async (notificationId, event) => {
    event.stopPropagation(); // Prevents event from propagating to the parent

    // Toggle expand state
    setExpandedNotifications((prevState) => ({
      ...prevState,
      [notificationId]: !prevState[notificationId],
    }));
    const notification = notifications.find((notif) => notif.id === notificationId);
    if (notification.is_seen) {
      // If notification is already marked as read, don't make the PUT request
      return;
    }
    // Mark notification as read
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/notifications/${user_id}/read/${notificationId}/`);
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, is_seen: true } : notification
          )
        );
        setMessageCount((prevCount) => prevCount - 1); // Decrease unread count
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const filteredNotifications =
    filterOption === 'unread' ? notifications.filter((n) => !n.is_seen) : notifications;

  const popover = (
    <Popover id="notification-popover" className="shadow-lg">
      <Popover.Header as="h3">Notifications</Popover.Header>
      <Popover.Body>
        <ButtonGroup className="w-100 mb-3">
          <ToggleButton
            id="all-notifications"
            type="radio"
            variant="outline-primary"
            value="all"
            checked={filterOption === 'all'}
            onChange={() => setFilterOption('all')}
          >
            Xem tất cả
          </ToggleButton>
          <ToggleButton
            id="unread-notifications"
            type="radio"
            variant="outline-primary"
            value="unread"
            checked={filterOption === 'unread'}
            onChange={() => setFilterOption('unread')}
          >
            Chưa đọc
          </ToggleButton>
        </ButtonGroup>

        <ListGroup variant="flush" className="px-2">
          {filteredNotifications.length ? (
            filteredNotifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`d-flex flex-column align-items-start ${notification.is_seen ? '' : 'bg-light'}`}
                onClick={handleNotificationClick}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {notification.type === "Payment" ? (
                      <>
                        <strong>{notification.full_name}</strong> đã mua khóa học{' '}
                        <strong>{notification.course_name}</strong>.
                        <div className="text-muted small">
                          {formatTime2(notification.created_at)} - {formatDate2(notification.created_at)}
                        </div>
                      </>
                    ) : (
                      <>
                        Cuộc họp <strong>{notification.course_name}</strong> được lên lịch.
                        <div className="text-muted small">
                          {formatTime2(notification.created_at)} - {formatDate2(notification.created_at)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {expandedNotifications[notification.id] && (
                  <div className="mt-2">
                    {notification.type === "Payment" ? (
                      <>
                        <p><strong>Số điện thoại:</strong> {notification.phone_number}</p>
                        <p><strong>Địa chỉ:</strong> {notification.address}</p>
                        <p><strong>Giá khóa học:</strong> {notification.course_price.toLocaleString()} VND</p>
                        <p><strong>Giảng viên:</strong> {notification.teacher_name}</p>
                        <p><strong>Thời gian mua:</strong> {formatTime2(notification.created_at)}</p>
                        <p><strong>Ngày mua:</strong> {formatDate2(notification.created_at)}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Thời gian họp:</strong>  {formatTime1(notification.time)} - {formatDate2(notification.time)}</p>
                        <p><strong>Khóa học:</strong> {notification.course_name}</p>
                        <p><strong>Giảng viên:</strong> {notification.teacher_name}</p>
                      </>
                    )}
                  </div>
                )}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2"
                  onClick={(event) => toggleExpand(notification.id, event)}
                >
                  {expandedNotifications[notification.id] ? 'Hide' : 'More'}
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <div className="text-center text-muted">No notifications</div>
          )}
        </ListGroup>

      </Popover.Body>
    </Popover>
  );

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0">
      <Link to="/" className="navbar-brand">
        <h1 className="m-0 text-primary">
          <i className="fa fa-book-reader me-3"></i>TeachTech
        </h1>
      </Link>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav mx-auto">
          {isLoggedIn ? (
            isTeacher ? (
              <>
                <Link to="/" className="nav-item nav-link">
                  Home
                </Link>
                <Link to="/classes" className="nav-item nav-link">
                  Classes
                </Link>
                <Link to="/schedule" className="nav-item nav-link">
                  Schedule
                </Link>
                <Link to="/documents" className="nav-item nav-link">
                  Documents
                </Link>
                <Link to="/meeting" className="nav-item nav-link">
                  Meetings
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="nav-item nav-link">
                  Home
                </Link>
                <Link to="/schedule" className="nav-item nav-link">
                  Schedule
                </Link>
                <Link to="/class" className="nav-item nav-link">
                  Class
                </Link>
                <Link to="/classes" className="nav-item nav-link">
                  Grades
                </Link>
                <Link to="/meeting-student" className="nav-item nav-link">
                  Meetings
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
          {isLoggedIn && (
            <>
              <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
                <div className="position-relative" style={{ cursor: 'pointer', right: '30px' }}>
                  <i className="fa fa-bell text-primary fs-4"></i>
                  {messageCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {messageCount}
                    </Badge>
                  )}
                </div>
              </OverlayTrigger>
              <span className="me-3 text-primary fw-bold">Hello, {fullName}</span>
            </>
          )}
          {isLoggedIn ? (
            <Button variant="primary" className="rounded-pill px-3" onClick={handleLogout}>
              Logout <i className="fa fa-arrow-right ms-2"></i>
            </Button>
          ) : (
            <Link to="/login" className="btn btn-primary rounded-pill px-3">
              Log in <i className="fa fa-arrow-right ms-2"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
