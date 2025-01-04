import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Typography, Spin } from "antd";
import moment from "moment"; // Import moment
import "moment/locale/vi"; // Import locale Tiếng Việt

const { Title } = Typography;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user_id, setUser_id] = useState(""); 

  // Đặt locale moment sang tiếng Việt
  moment.locale("vi");

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Khóa học",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Ngày đăng ký khóa học",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (text) => {
        // Sử dụng moment để định dạng lại payment_date
        return moment(text).format("DD [Tháng] MM, YYYY"); // Ví dụ: 05 Tháng 01, 2025
      },
    },
  ];

  useEffect(() => {
    // Lấy user_id từ localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser_id(userData.id);
    }
  }, []); // Chạy 1 lần khi component được mount

  useEffect(() => {
    // Gọi fetchStudents chỉ khi user_id không rỗng
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/students/", {
          params: { user_id: user_id },
        });
        setStudents(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchStudents();
    }
  }, [user_id]); // Chạy lại khi user_id thay đổi

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <Card style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={2} style={{ color: "#333", textAlign: "center" }}>
          Danh sách sinh viên
        </Title>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table
            columns={columns}
            dataSource={students}
            pagination={{ pageSize: 5 }}
            rowKey="id"
            style={{
              backgroundColor: "#fff",
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default StudentList;
