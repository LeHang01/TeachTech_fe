import React, { useState } from 'react';
import { Container, Row, Col, Nav, Table, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx'; // Thêm import thư viện xlsx để xuất Excel
import './classes.css'; // Nếu cần thêm CSS tùy chỉnh

const Classes = () => {
  const [selectedCourse, setSelectedCourse] = useState(''); // Lưu khóa học đang được chọn
  const [studentsData, setStudentsData] = useState([]); // Dữ liệu sinh viên

  // Dữ liệu mẫu cho các khóa học
  const courses = {
    'Tester cơ bản': [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        registrationDate: '01/01/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      {
        id: 2,
        name: 'Trần Thị B',
        registrationDate: '01/02/2023',
        attendanceStatus: 'Chưa điểm danh',
      },
      {
        id: 3,
        name: 'Lê Minh C',
        registrationDate: '02/01/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      {
        id: 4,
        name: 'Nguyễn Thị D',
        registrationDate: '05/01/2023',
        attendanceStatus: 'Chưa điểm danh',
      },
      {
        id: 5,
        name: 'Mai Quang E',
        registrationDate: '10/01/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      // Thêm nhiều sinh viên khác
    ],
    'Tester nâng cao': [
      {
        id: 1,
        name: 'Phan Thị C',
        registrationDate: '05/01/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      {
        id: 2,
        name: 'Lê Văn D',
        registrationDate: '06/01/2023',
        attendanceStatus: 'Chưa điểm danh',
      },
      // Thêm nhiều sinh viên khác
    ],
    'Python cơ bản': [
      {
        id: 1,
        name: 'Nguyễn Thanh E',
        registrationDate: '10/02/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      {
        id: 2,
        name: 'Hoàng Kim F',
        registrationDate: '11/02/2023',
        attendanceStatus: 'Chưa điểm danh',
      },
      { id: 3, name: 'Lý Sơn G', registrationDate: '15/02/2023', attendanceStatus: 'Đã điểm danh' },
      // Thêm nhiều sinh viên khác
    ],
    'Python nâng cao': [
      {
        id: 1,
        name: 'Mai Lan G',
        registrationDate: '15/02/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      {
        id: 2,
        name: 'Trần Hữu H',
        registrationDate: '16/02/2023',
        attendanceStatus: 'Chưa điểm danh',
      },
      {
        id: 3,
        name: 'Nguyễn Ngọc I',
        registrationDate: '20/02/2023',
        attendanceStatus: 'Đã điểm danh',
      },
      // Thêm nhiều sinh viên khác
    ],
  };

  // Hàm chọn khóa học và cập nhật danh sách sinh viên
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setStudentsData(courses[course] || []);
  };

  // Hàm xuất file Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(studentsData); // Chuyển dữ liệu thành sheet Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sinh viên'); // Tạo sheet Excel
    const fileName = `${selectedCourse}_Danh_sach_sinh_vien.xlsx`; // Đặt tên file theo tên khóa học
    XLSX.writeFile(wb, fileName); // Xuất file với tên khóa học
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col sm={3} className="sidebar">
          <h4>Danh sách khóa học</h4>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link onClick={() => handleCourseSelect('Tester cơ bản')}>Tester cơ bản</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleCourseSelect('Tester nâng cao')}>
                Tester nâng cao
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleCourseSelect('Python cơ bản')}>Python cơ bản</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleCourseSelect('Python nâng cao')}>
                Python nâng cao
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Nội dung chi tiết khóa học */}
        <Col sm={9}>
          <h3 style={{ color: '#FFFFFF' }}>
            {selectedCourse
              ? `Danh sách sinh viên của khóa ${selectedCourse}`
              : 'Chọn khóa học để xem danh sách sinh viên'}
          </h3>

          {/* Hiển thị bảng danh sách sinh viên */}
          {selectedCourse && (
            <>
              <Button variant="primary" onClick={exportToExcel} style={{ marginBottom: '20px' }}>
                Xuất Excel
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái điểm danh</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.registrationDate}</td>
                      <td>{student.attendanceStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Classes;
