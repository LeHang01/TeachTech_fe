import { Table, Button, Tag, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { FileTextOutlined, FileImageOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';

import "./MeetingTable.css";
import axios from "axios";

const MeetingTable = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Quản lý hiển thị Modal
  const [selectedFileUrl, setSelectedFileUrl] = useState(""); // URL file đã chọn
  const [selectedFileName, setSelectedFileName] = useState(""); // Tên file đã chọn
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 }); // Vị trí modal

  useEffect(() => {
    // Hàm gọi API lấy dữ liệu cuộc họp
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/meetings/");
        setMeetings(response.data); // Lưu dữ liệu trả về vào state
      } catch (error) {
        message.error("Không thể tải dữ liệu cuộc họp");
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchMeetings(); // Gọi hàm khi component render
  }, []);

  // Hàm format datetime sang ngày
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Hàm xử lý nhấp vào tên tệp
  const handleClick = (e, fileUrl, fileName) => {
    e.preventDefault(); // Ngừng hành động mặc định của click
    setSelectedFileUrl(fileUrl); // Lưu URL tệp
    setSelectedFileName(fileName); // Lưu tên tệp
    setModalPosition({
      x: e.clientX,
      y: e.clientY
    }); // Cập nhật vị trí của modal
    setModalVisible(true); // Hiển thị Modal
  };


  const handleDowloadFile = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:9000/teachtech-bucket/${selectedFileUrl}`; // URL của tệp
    link.download = selectedFileUrl.split("/").pop(); // Lấy tên tệp từ URL
    link.click(); // Mô phỏng click để tải xuống
    setModalVisible(false); // Đóng modal sau khi tải xuống
  };
  

  // Hàm format datetime sang giờ
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };
  const getFileIcon = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#E53935', fontSize: '18px' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ color: '#42A5F5', fontSize: '18px' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#66BB6A', fontSize: '18px' }} />;
      case 'doc':
      case 'docx':
        return <FileTextOutlined style={{ color: '#FFA000', fontSize: '18px' }} />;
      default:
        return <FileTextOutlined style={{ color: '#757575', fontSize: '18px' }} />;
    }
  };
  const handleAttendClick = (meetingId) => {
    navigate(`/attendance/${meetingId}`); // Navigate to the attendance page with meeting ID
  };
  // Hàm xử lý cập nhật trạng thái cuộc họp
  const updateMeetingStatus = async (meetingId) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/meetings/${meetingId}/update_status/`, {
        status: "Đang diễn ra",
      });
      message.success("Trạng thái đã được cập nhật thành Đang diễn ra");
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, status: "Đang diễn ra" } : meeting
        )
      );
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
    }
  };
  
  const handleJoinMeeting = (meetingId, link) => {
    updateMeetingStatus(meetingId); // Gọi hàm cập nhật trạng thái
    window.open(link, "_blank"); // Mở liên kết cuộc họp
  };
  const updateMeetingStatusToEnd = async (meetingId) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/meetings/${meetingId}/update_status/`, {
        status: "Đã kết thúc",
      });
      message.success("Trạng thái đã được cập nhật thành Đã kết thúc");
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, status: "Đã kết thúc" } : meeting
        )
      );
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
    }
  };
  

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Chủ đề bài học",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Nền tảng",
      dataIndex: "platform",
      key: "platform",
      render: (platform) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Display platform name */}
          <Tag color="orange" style={{ margin: 0 }}>
            {platform}
          </Tag>
        </div>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date_time",
      key: "date_time",
      render: (dateTime) => formatDate(dateTime), // Format ngày
    },
    {
      title: "Giờ",
      dataIndex: "date_time",
      key: "date_time",
      render: (dateTime) => formatTime(dateTime), // Format giờ
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đã kết thúc" ? "red" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "File đính kèm",
      dataIndex: "attachments",
      key: "attachments",
      render: (attachments) =>
        attachments.length > 0 ? (
          <div className="attachment-container">
            <div>
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  onClick={(e) => handleClick(e, attachment.file_url, attachment.file_url.split("/").pop())}
                  style={{
                    cursor: "pointer", 
                    margin: "5px 0", 
                    display: "flex", 
                    alignItems: "center",
                    padding: "5px", 
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5", // Light background for better contrast
                  }}
                >
                  {/* Display file icon */}
                  <div style={{ marginRight: "8px" }}>
                    {getFileIcon(attachment.file_url)}
                  </div>
                  {/* Display file name */}
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    {attachment.file_url.split("/").pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          "-"
        ),
    },   
    {
      title: "Hành động",
      dataIndex: "link",
      key: "link",
      render: (link, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>     
          {/* Hiển thị nút Tham gia nếu trạng thái không phải là "Đã kết thúc" */}
          {record.status === "Đang diễn ra" ? (
            <Button
              type="primary"
              size="small"
              danger
              onClick={async () => {
                await updateMeetingStatusToEnd(record.id); // Kết thúc cuộc họp
              }}
            >
              Kết thúc
            </Button>
          ) : record.status !== "Đã kết thúc" ? (
            <Button
              type="primary"
              size="small"
              onClick={() => handleJoinMeeting(record.id, link)} // Tham gia cuộc họp
            >
              Bắt đầu
            </Button>
          ) : null}
                    <Button
            type="primary"
            size="small"
            onClick={() => handleAttendClick(record.id)} // Gọi hàm điểm danh
            style={{
              backgroundColor: '#FF9800', // Màu cam
              borderColor: '#FF9800',
              color: '#fff',
            }}
          >
            Điểm danh
          </Button>
        </div>
      ),
    },
      
  ];

  // Hàm đóng modal khi nhấn vào biểu tượng đóng
  const handleCloseModal = () => {
    setModalVisible(false); // Đóng modal
  };

  return (
    <div className="meeting-container">
      <h1 className="meeting-title">Tất cả cuộc họp</h1>
      <Button
        type="primary"
        className="add-meeting-btn"
        onClick={() => navigate("/add-meeting")}
        style={{
          backgroundColor: 'rgb(2 104 231)', // Orange color
          borderColor: 'rgb(2 104 231)', // Ensure the border matches the background
          color: '#fff', // White text for contrast
        }}
      >
        + Tạo cuộc họp
      </Button>
      <Table
        columns={columns}
        dataSource={meetings}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        loading={loading}
      />

      {/* Modal hiển thị các tùy chọn */}
      {modalVisible && (
        <div
          style={{
            position: "absolute",
            top: modalPosition.y,
            left: modalPosition.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: 999,
            width: "200px", // Căn chỉnh kích thước Modal
            borderRadius:"10px"
          }}
        >
          <CloseOutlined
            onClick={handleCloseModal} // Thêm sự kiện để đóng modal
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
            }}
          />
          <div style={{ cursor: "pointer", padding: "5px 0" }} onClick={handleDowloadFile}>
            <DownloadOutlined /> Tải xuống
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingTable;
