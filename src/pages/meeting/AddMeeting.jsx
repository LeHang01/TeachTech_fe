import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, TimePicker, Button, Upload, Select, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios"; // Import axios
import "./AddMeeting.css";

const AddMeeting = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [user_id, setUser_id] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser_id(userData.id);
    }
  }, []);
  
  const handleAddMeeting = async (values) => {
    try {
      // Chuyển đổi thời gian và ngày
      const dateTime = moment(values.date).format("YYYY-MM-DD") + " " + moment(values.time).format("HH:mm:ss");

      // Tạo dữ liệu gửi lên backend
      const formData = new FormData();
      formData.append("topic", values.topic);
      formData.append("platform", values.platform);
      formData.append("link", values.link);
      formData.append("dateTime", dateTime);  // Gửi dateTime đã chuyển đổi
      formData.append("content", values.content);
      formData.append("user_id", user_id); // Gửi user_id nếu cần

      // Gửi file
      fileList.forEach(file => {
        formData.append("files[]", file.originFileObj);
      });

      // Gửi yêu cầu POST lên backend
      const response = await axios.post("http://127.0.0.1:8000/api/meetings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo kiểu dữ liệu là multipart
        },
      });

      // Xử lý phản hồi từ backend
      if (response.status === 201) {
        message.success("Buổi học đã tạo thành công!");
        form.resetFields();
        setFileList([]);
        navigate("/meeting"); // Điều hướng sau khi thành công
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  const handleCancel = () => {
    navigate("/meeting");
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    // Lọc danh sách file không trùng lặp dựa trên tên
    const uniqueFiles = newFileList.reduce((acc, file) => {
      if (!acc.some((f) => f.name === file.name)) {
        acc.push(file);
      }
      return acc;
    }, []);
    setFileList(uniqueFiles);
  };

  return (
    <div className="meeting-form-container">
      <h2>Thêm Buổi Học Mới</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddMeeting}
        initialValues={{
          status: "Chưa bắt đầu",
          date: moment(),
          time: moment(),
        }}
      >
        <Form.Item
          label="Chủ đề"
          name="topic"
          rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}>
          <Input placeholder="Nhập chủ đề" />
        </Form.Item>

        <Form.Item
          label="Nền tảng học"
          name="platform"
          rules={[{ required: true, message: "Vui lòng chọn nền tảng học!" }]}>
          <Select placeholder="Chọn nền tảng học">
            <Select.Option value="Zoom">Zoom</Select.Option>
            <Select.Option value="Microsoft Teams">Microsoft Teams</Select.Option>
            <Select.Option value="Google Meet">Google Meet</Select.Option>
            <Select.Option value="Skype">Skype</Select.Option>
            <Select.Option value="Cisco Webex">Cisco Webex</Select.Option>
            <Select.Option value="GoToMeeting">GoToMeeting</Select.Option>
            <Select.Option value="BlueJeans">BlueJeans</Select.Option>
            <Select.Option value="Slack">Slack</Select.Option>
            <Select.Option value="Other">Khác</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Đường dẫn học"
          name="link"
          rules={[{ required: true, message: "Vui lòng nhập đường dẫn học!" }, { type: "url", message: "Đường dẫn không hợp lệ!" }]}>
          <Input placeholder="Nhập đường dẫn học (VD: https://zoom.us/...)" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giờ"
              name="time"
              rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}>
              <TimePicker format="HH:mm:ss" style={{ width: "100%" }} minuteStep={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}>
          <Input.TextArea rows={4} placeholder="Nhập nội dung buổi học" />
        </Form.Item>

        <Form.Item label="Tài liệu học">
          <Upload
            beforeUpload={() => false} // Không tự động upload file
            fileList={fileList}
            onChange={handleFileChange}
            multiple={true}
            accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx">
            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="button-group">
            <Button onClick={handleCancel} className="cancel-button">Hủy</Button>
            <Button type="primary" htmlType="submit" className="save-button">Lưu</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMeeting;
