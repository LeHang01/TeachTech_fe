import React, { useState } from 'react';
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

const Schedule = () => {
  const [view, setView] = useState('all'); // Chế độ xem: 'all', 'schedule', 'exam'
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date())); // Tính ngày đầu tuần hiện tại

  // Dữ liệu lịch học mẫu
  const scheduleData = [
    {
      day: 'Thứ 2',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Thực hành - Python nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Nguyễn Văn A',
        status: '',
      },
      evening: {
        subject: 'Lý thuyết - JavaScript cơ bản',
        time: '18:00 - 20:30',
        lecturer: 'Trần Thị B',
        status: '',
      },
    },
    {
      day: 'Thứ 3',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Lịch thi - JavaScript nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Hội đồng thi',
        status: '',
      },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
    {
      day: 'Thứ 4',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Thực hành - C nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Lê Văn C',
        status: 'makeup',
      },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
    {
      day: 'Thứ 5',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Thực hành - C nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Lê Văn C',
        status: 'paused',
      },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
    {
      day: 'Thứ 6',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Thực hành - C nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Lê Văn C',
        status: '',
      },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
    {
      day: 'Thứ 7',
      morning: { subject: '', time: '', lecturer: '', status: '' },
      afternoon: {
        subject: 'Thực hành - C nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Lê Văn C',
        status: 'paused',
      },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
    {
      day: 'Chủ nhật',
      morning: {
        subject: 'Thực hành - C nâng cao',
        time: '13:00 - 15:30',
        lecturer: 'Lê Văn C',
        status: '',
      },
      afternoon: { subject: '', time: '13:00 - 15:30', lecturer: 'Lê Văn C', status: 'paused' },
      evening: { subject: '', time: '', lecturer: '', status: '' },
    },
  ];

  // Hàm để tính ngày đầu tuần (Thứ 2)
  function getWeekStart(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Đảm bảo Thứ 2 là ngày bắt đầu
    start.setDate(diff);
    start.setHours(0, 0, 0, 0); // Đặt giờ là 00:00
    return start;
  }

  // Hàm chuyển tuần sang tuần tiếp theo
  const nextWeek = () => {
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7); // Cộng 7 ngày để chuyển sang tuần tiếp theo
    setWeekStart(nextWeekStart);
  };

  // Hàm trở về tuần hiện tại
  const goToCurrentWeek = () => {
    const today = new Date();
    setWeekStart(getWeekStart(today));
  };

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

          <Button
            style={{ marginLeft: '850px', marginBottom: '10px' }}
            variant="secondary"
            onClick={goToCurrentWeek}
            className="mr-3"
          >
            Hiện tại
          </Button>
          <Button
            style={{ marginLeft: '3px', marginBottom: '10px' }}
            variant="primary"
            onClick={nextWeek}
          >
            Tuần tiếp theo
          </Button>

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
                    className={getClassForLabel(data.morning.subject, data.morning.status)}
                  >
                    {data.morning.subject ? (
                      <>
                        <div>{data.morning.subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.morning.time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.morning.lecturer}
                        </div>
                        {data.morning.status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.morning.status === 'makeup' && (
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
                    className={getClassForLabel(data.afternoon.subject, data.afternoon.status)}
                  >
                    {data.afternoon.subject ? (
                      <>
                        <div>{data.afternoon.subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.afternoon.time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.afternoon.lecturer}
                        </div>
                        {data.afternoon.status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.afternoon.status === 'makeup' && (
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
                    className={getClassForLabel(data.evening.subject, data.evening.status)}
                  >
                    {data.evening.subject ? (
                      <>
                        <div>{data.evening.subject}</div>
                        <div style={{ fontSize: '0.85em', color: 'white' }}>
                          {data.evening.time}
                        </div>
                        <div style={{ fontSize: '0.85em', fontStyle: 'italic', color: 'white' }}>
                          {data.evening.lecturer}
                        </div>
                        {data.evening.status === 'paused' && (
                          <div style={{ fontSize: '0.85em', color: '#FFCDD2', fontWeight: 'bold' }}>
                            Tạm ngưng
                          </div>
                        )}
                        {data.evening.status === 'makeup' && (
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

export default Schedule;
