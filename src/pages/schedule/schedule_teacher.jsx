import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  ButtonGroup,
  ToggleButton,
  Badge,
} from 'react-bootstrap';
import './schedule.css';

const TeacherSchedule = () => {
  const [view, setView] = useState('all'); // Chế độ xem: 'all', 'schedule', 'exam'
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date())); // Tính ngày đầu tuần hiện tại
  const [scheduleData, setScheduleData] = useState([]);
  const [user_id, setUserId] = useState('');
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUserId(userData.id)
        }
    if (user_id) {
      fetchScheduleData(); // Gọi API khi component mount hoặc khi userId thay đổi
    }
  }, [user_id]);
  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/schedule/by-teacher/`, {
        params: {
          user_id: user_id,
        },
      });
      
      setScheduleData(response.data); // Giả sử response.data là mảng lịch học
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu lịch học:", error);
    }
  };
  // Hàm để tính ngày đầu tuần (Thứ 2)
  function getWeekStart(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Đảm bảo Thứ 2 là ngày bắt đầu
    start.setDate(diff);
    start.setHours(0, 0, 0, 0); // Đặt giờ là 00:00
    return start;
  }
  // Hàm xác định lớp CSS dựa trên nội dung
  const getClassForLabel = (text, status) => {
    if (!text) return ''; // Nếu không có dữ liệu thì không thêm lớp
    if (status === 'paused') return 'bg-paused strikethrough'; // Tạm ngưng và áp dụng lớp gạch ngang
    if (status === 'makeup') return 'bg-makeup'; // Học bù
    if (text.startsWith('Lý thuyết')) return 'bg-gray';
    if (text.startsWith('Thực hành')) return 'bg-green';
    if (text.startsWith('Lịch thi')) return 'bg-yellow';
    return ''; // Không áp dụng màu nếu không khớp
  };

  // Hàm để định dạng ngày theo dd/mm/yyyy
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Lấy tháng (bắt đầu từ 0)
    const year = date.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
  };

  // Hàm hiển thị ngày và ngày tháng năm
  const getDayWithDate = (dayIndex) => {
    const dayOfWeek = new Date(weekStart);
    dayOfWeek.setDate(weekStart.getDate() + dayIndex);
    return {
      day: scheduleData[dayIndex].day,
      date: formatDate(dayOfWeek),
    };
  };

  return (
    <Container
      className="mt-4"
      style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' }}
    >
      <Row>
        <Col>
          <h3 style={{ color: '#495057', textAlign: 'center' }}>Lịch học, Lịch thi theo tuần</h3>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          
          <ButtonGroup className="mb-3">
            <ToggleButton
              type="radio"
              variant="outline-primary"
              value="all"
              checked={view === 'all'}
              onChange={() => setView('all')}
            >
              Tất cả
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="outline-primary"
              value="schedule"
              checked={view === 'schedule'}
              onChange={() => setView('schedule')}
            >
              Lịch học
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="outline-primary"
              value="exam"
              checked={view === 'exam'}
              onChange={() => setView('exam')}
            >
              Lịch thi
            </ToggleButton>
          </ButtonGroup>
            <Link to="/create-schedule"> {/* Link chuyển trang */}
              <Button variant="primary">Tạo lịch học</Button>
            </Link>
          </div>

          <Table
            bordered
            responsive
            style={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '16px' }}
          >
            <thead>
              <tr className="thead-header">
                <th>Ca học</th>
                {scheduleData.map((data, index) => {
                  const { day, date } = getDayWithDate(index);
                  return (
                    <th key={index}>
                      <div style={{ fontWeight: 'bold' }}>{day}</div>
                      <div style={{ fontSize: '0.9em' }}>{date}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sáng</td>
                {scheduleData.map((data, index) => (
                  <td
                    key={index}
                    className={getClassForLabel(data.morning_subject, data.morning_status)}
                  >
                    {data.morning_subject ? (
                      <>
                        <div>{data.morning_subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.morning_time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.morning_lecturer}
                        </div>
                        {data.morning_status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.morning_status === 'makeup' && (
                          <div style={{ fontSize: '0.85em', color: '#FFF59D', fontWeight: 'bold' }}>
                            Học bù
                          </div>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Chiều</td>
                {scheduleData.map((data, index) => (
                  <td
                    key={index}
                    className={getClassForLabel(data.afternoon_subject, data.afternoon_status)}
                  >
                    {data.afternoon_subject ? (
                      <>
                        <div>{data.afternoon_subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.afternoon_time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.afternoon_lecturer}
                        </div>
                        {data.afternoon_status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.afternoon_status === 'makeup' && (
                          <div style={{ fontSize: '0.85em', color: '#FFF59D', fontWeight: 'bold' }}>
                            Học bù
                          </div>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Tối</td>
                {scheduleData.map((data, index) => (
                  <td
                    key={index}
                    className={getClassForLabel(data.evening_subject, data.evening_status)}
                  >
                    {data.evening_subject ? (
                      <>
                        <div>{data.evening_subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.evening_time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.evening_lecturer}
                        </div>
                        {data.evening_status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.evening_status === 'makeup' && (
                          <div style={{ fontSize: '0.85em', color: '#FFF59D', fontWeight: 'bold' }}>
                            Học bù
                          </div>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>

          <div className="mt-4">
            <Badge className="mr-2 bg-gray">Lý thuyết</Badge>
            <Badge className="mr-2 bg-green">Thực hành</Badge>
            <Badge className="bg-yellow">Lịch thi</Badge>
            <Badge className="bg-tam-ngung">Tạm ngưng</Badge>
            <Badge className="bg-hoc-bu">Học bù</Badge>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherSchedule;
