import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Accordion, Tab, Nav ,Alert } from 'react-bootstrap';
import axios from 'axios';
import './create_schedule.css';
import { toast} from "react-toastify";

const ScheduleForm = () => {
  const [selectedDay, setSelectedDay] = useState('Thứ 2');
  const [fullName, setFullName] = useState('');
  const [user_id, setUserId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setFullName(userData.full_name);
        setCourseName(userData.course_name)
        setUserId(userData.id)
      } else {
      }
    }, []);
    useEffect(() => {
      const updatedWeekSchedule = { ...weekSchedule };
      Object.keys(updatedWeekSchedule).forEach(day => {
        updatedWeekSchedule[day].morning_lecturer = fullName;
        updatedWeekSchedule[day].afternoon_lecturer = fullName;
        updatedWeekSchedule[day].evening_lecturer = fullName;
        updatedWeekSchedule[day].morning_subject = courseName;  // Thêm tên khóa học vào buổi sáng
        updatedWeekSchedule[day].afternoon_subject = courseName;  // Thêm tên khóa học vào buổi chiều
        updatedWeekSchedule[day].evening_subject = courseName;  // Thêm tên khóa học vào buổi tối
      });
      setWeekSchedule(updatedWeekSchedule);
    }, [fullName, courseName]);
    
    
  const [weekSchedule, setWeekSchedule] = useState({
    'Thứ 2': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Thứ 3': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Thứ 4': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Thứ 5': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Thứ 6': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Thứ 7': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
    'Chủ nhật': {
      morning_subject: '',
      morning_time: '',
      morning_lecturer: `${fullName}`,
      morning_status: '',
      morning_type: 'Lý thuyết',
      afternoon_subject: '',
      afternoon_time: '',
      afternoon_lecturer: `${fullName}`,
      afternoon_status: '',
      afternoon_type: 'Lý thuyết',
      evening_subject: '',
      evening_time: '',
      evening_lecturer: `${fullName}`,
      evening_status: '',
      evening_type: 'Lý thuyết',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setWeekSchedule((prevWeekSchedule) => {
      const updatedSchedule = {
        ...prevWeekSchedule,
        [selectedDay]: {
          ...prevWeekSchedule[selectedDay],
          [name]: value,
        },
      };

      // If a session (morning, afternoon, or evening) is filled, clear the other two.
      if (name.includes('morning')) {
        updatedSchedule[selectedDay].afternoon_subject = '';
        updatedSchedule[selectedDay].afternoon_time = '';
        updatedSchedule[selectedDay].afternoon_lecturer = '';
        updatedSchedule[selectedDay].evening_subject = '';
        updatedSchedule[selectedDay].evening_time = '';
        updatedSchedule[selectedDay].evening_lecturer = '';
      } else if (name.includes('afternoon')) {
        updatedSchedule[selectedDay].morning_subject = '';
        updatedSchedule[selectedDay].morning_time = '';
        updatedSchedule[selectedDay].morning_lecturer = '';
        updatedSchedule[selectedDay].evening_subject = '';
        updatedSchedule[selectedDay].evening_time = '';
        updatedSchedule[selectedDay].evening_lecturer = '';
      } else if (name.includes('evening')) {
        updatedSchedule[selectedDay].morning_subject = '';
        updatedSchedule[selectedDay].morning_time = '';
        updatedSchedule[selectedDay].morning_lecturer = '';
        updatedSchedule[selectedDay].afternoon_subject = '';
        updatedSchedule[selectedDay].afternoon_time = '';
        updatedSchedule[selectedDay].afternoon_lecturer = '';
      }

      return updatedSchedule;
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: user_id, // Thay currentUserId bằng giá trị user_id của người dùng hiện tại
      week_schedule: weekSchedule,
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/schedule/', payload);
      toast.success("Cập nhật lịch học thành công.");
    } catch (error) {
      toast.error("Lỗi khi lưu lịch học.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center text-white mb-4">Tạo Lịch Học - {selectedDay}</h2>
      <Card className="bg-dark text-light p-4">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Chọn ngày</Accordion.Header>
            <Accordion.Body>
              <Form.Group controlId="formDay">
                <Form.Control
                  as="select"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="Thứ 2">Thứ 2</option>
                  <option value="Thứ 3">Thứ 3</option>
                  <option value="Thứ 4">Thứ 4</option>
                  <option value="Thứ 5">Thứ 5</option>
                  <option value="Thứ 6">Thứ 6</option>
                  <option value="Thứ 7">Thứ 7</option>
                  <option value="Chủ nhật">Chủ nhật</option>
                </Form.Control>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="morning">
            <Row>
              <Col sm={4}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="morning">Buổi sáng</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="afternoon">Buổi chiều</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="evening">Buổi tối</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  {/* Buổi sáng */}
                  <Tab.Pane eventKey="morning">
                    <Form.Group controlId="formMorningType">
                      <Form.Label>Hình thức</Form.Label>
                      <Form.Control
                        as="select"
                        name="morning_type"
                        value={weekSchedule[selectedDay]?.morning_type || "Lý thuyết"}
                        onChange={handleChange}
                      >
                        <option value="Lý thuyết">Lý thuyết</option>
                        <option value="Thực hành">Thực hành</option>
                        <option value="Lịch thi">Lịch thi</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formMorningSubject">
                      <Form.Label>Tên môn học</Form.Label>
                      <Form.Control
                        type="text"
                        name="morning_subject"
                        value={weekSchedule[selectedDay].morning_subject}
                        onChange={handleChange}
                        placeholder="Chủ đề"
                      />
                    </Form.Group>
                    <Form.Group controlId="formMorningTime">
                      <Form.Label>Thời gian</Form.Label>
                      <Form.Control
                        type="text"
                        name="morning_time"
                        value={weekSchedule[selectedDay].morning_time}
                        onChange={handleChange}
                        placeholder="Ví dụ: 08:00 - 10:00"
                      />
                    </Form.Group>
                    <Form.Group controlId="formMorningLecturer">
                      <Form.Label>Giảng viên</Form.Label>
                      <Form.Control
                        type="text"
                        name="morning_lecturer"
                        value={weekSchedule[selectedDay].morning_lecturer}
                        onChange={handleChange}
                        placeholder="Giảng viên"
                      />
                    </Form.Group>
                  </Tab.Pane>

                  {/* Buổi chiều */}
                  <Tab.Pane eventKey="afternoon">
                    <Form.Group controlId="formAfternoonType">
                      <Form.Label>Hình thức</Form.Label>
                      <Form.Control
                        as="select"
                        name="afternoon_type"
                        value={weekSchedule[selectedDay]?.afternoon_type || "Lý thuyết"}
                        onChange={handleChange}
                      >
                        <option value="Lý thuyết">Lý thuyết</option>
                        <option value="Thực hành">Thực hành</option>
                        <option value="Lịch thi">Lịch thi</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formAfternoonSubject">
                      <Form.Label>Tên môn học</Form.Label>
                      <Form.Control
                        type="text"
                        name="afternoon_subject"
                        value={weekSchedule[selectedDay].afternoon_subject}
                        onChange={handleChange}
                        placeholder="Chủ đề"
                      />
                    </Form.Group>
                    <Form.Group controlId="formAfternoonTime">
                      <Form.Label>Thời gian</Form.Label>
                      <Form.Control
                        type="text"
                        name="afternoon_time"
                        value={weekSchedule[selectedDay].afternoon_time}
                        onChange={handleChange}
                        placeholder="Ví dụ: 13:00 - 15:00"
                      />
                    </Form.Group>
                    <Form.Group controlId="formAfternoonLecturer">
                      <Form.Label>Giảng viên</Form.Label>
                      <Form.Control
                        type="text"
                        name="afternoon_lecturer"
                        value={weekSchedule[selectedDay].afternoon_lecturer}
                        onChange={handleChange}
                        placeholder="Giảng viên"
                      />
                    </Form.Group>
                  </Tab.Pane>

                  {/* Buổi tối */}
                  <Tab.Pane eventKey="evening">
                    <Form.Group controlId="formEveningType">
                      <Form.Label>Hình thức</Form.Label>
                      <Form.Control
                        as="select"
                        name="evening_type"
                        value={weekSchedule[selectedDay]?.evening_type || "Lý thuyết"}
                        onChange={handleChange}
                      >
                        <option value="Lý thuyết">Lý thuyết</option>
                        <option value="Thực hành">Thực hành</option>
                        <option value="Lịch thi">Lịch thi</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formEveningSubject">
                      <Form.Label>Tên môn học</Form.Label>
                      <Form.Control
                        type="text"
                        name="evening_subject"
                        value={weekSchedule[selectedDay].evening_subject}
                        onChange={handleChange}
                        placeholder="Chủ đề"
                      />
                    </Form.Group>
                    <Form.Group controlId="formEveningTime">
                      <Form.Label>Thời gian</Form.Label>
                      <Form.Control
                        type="text"
                        name="evening_time"
                        value={weekSchedule[selectedDay].evening_time}
                        onChange={handleChange}
                        placeholder="Ví dụ: 18:00 - 20:00"
                      />
                    </Form.Group>
                    <Form.Group controlId="formEveningLecturer">
                      <Form.Label>Giảng viên</Form.Label>
                      <Form.Control
                        type="text"
                        name="evening_lecturer"
                        value={weekSchedule[selectedDay].evening_lecturer}
                        onChange={handleChange}
                        placeholder="Giảng viên"
                      />
                    </Form.Group>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>

          <Button variant="primary" type="submit" className="w-100" style={{ marginTop: "20px" }}>
            Lưu lịch học
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ScheduleForm;
