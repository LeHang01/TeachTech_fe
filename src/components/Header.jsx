import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Badge,
  ListGroup,
  Button,
  OverlayTrigger,
  Popover,
  ToggleButton,
  ButtonGroup,
} from 'react-bootstrap';
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [fullName, setFullName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [filterOption, setFilterOption] = useState('all'); // 'all' or 'unread'

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setIsLoggedIn(true);
      setIsTeacher(userData.is_teacher);
      setFullName(userData.full_name);
    } else {
      setIsLoggedIn(false);
    }

    const mockNotifications = [
      {
        id: 1,
        title: 'Thông báo nghỉ học!',
        content: 'Thứ 2 ngày 23/12/2024 cô bận, các em học bù vào ngày 25/12/2024.',
        read: false,
      },
      {
        id: 2,
        title: 'Điểm số được cập nhật!',
        content:
          'Điểm môn Toán của bạn đã được cập nhật. Đây là thông tin chi tiết về điểm số mới.',
        read: false,
      },
      {
        id: 3,
        title: 'Nhắc nhở sự kiện!',
        content:
          'Đừng quên sự kiện diễn ra vào ngày mai. Đây là một số thông tin chi tiết về sự kiện.',
        read: true,
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);
  const handleNotificationClick = () => {
    navigate('/schedule');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleExpand = (notificationId, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện tiếp tục lan tỏa (ngăn không chuyển hướng khi nhấn "More")
    setExpandedNotifications((prevState) => ({
      ...prevState,
      [notificationId]: !prevState[notificationId],
    }));
  };

  const filteredNotifications =
    filterOption === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const popover = (
    <Popover id="notification-popover" className="shadow-lg">
      <Popover.Header as="h3">Notifications</Popover.Header>
      <Popover.Body>
        {/* Segmented Control */}
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

        {/* Notification List */}
        {/* Notification List */}
        <ListGroup variant="flush" className="px-2">
          {filteredNotifications.length ? (
            filteredNotifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`d-flex flex-column align-items-start ${
                  notification.read ? '' : 'bg-light'
                }`}
                onClick={handleNotificationClick} // Điều hướng khi nhấn vào thông báo
              >
                <div>
                  <strong>{notification.title}</strong>
                </div>
                <div className="mt-1">
                  <small className="text-muted">
                    {expandedNotifications[notification.id]
                      ? notification.content
                      : `${notification.content.substring(0, 30)}...`}
                  </small>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2"
                  onClick={(event) => toggleExpand(notification.id, event)} // Gọi toggleExpand và ngăn chặn điều hướng
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
          {isLoggedIn && (
            <>
              <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
                <div className="position-relative" style={{ cursor: 'pointer', right: '30px' }}>
                  <i className="fa fa-bell text-primary fs-4"></i>
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {unreadCount}
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
