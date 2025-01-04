import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doimatkhau.css";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
    
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [user_id, setUser_id] = useState(""); 
    useEffect(() => {
      // Lấy user_id từ localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser_id(userData.id);
      }
    }, []);

  const handleVisibilityToggle = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    } else {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/change-password/`, {
          user_id: user_id, // Truyền user_id vào từ props hoặc state
          old_password: oldPassword,
          new_password: newPassword,
        });
        // Hiển thị thông báo thành công
        if (response.status === 200) {
          toast.success(response.data.message || "Đổi mật khẩu thành công.");
          form.resetFields();
        }
      } catch (error) {
        if (error.response) {
          // Hiển thị thông báo lỗi từ backend
          toast.error(error.response.data.message || "Đã xảy ra lỗi.");
        } else {
          toast.error("Lỗi mạng. Vui lòng thử lại sau.");
        }
      }
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Card
        className="shadow p-4"
        style={{ maxWidth: 500, width: "100%", borderRadius: "10px" }}
      >
        <h2 className="text-center mb-3">Đổi Mật Khẩu</h2>
        <p className="text-center text-muted mb-4">
          Bảo vệ tài khoản của bạn bằng cách thay đổi mật khẩu định kỳ.
        </p>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            className="mb-3"
            showIcon
          />
        )}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input
              type={passwordVisibility.oldPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu cũ"
              suffix={
                passwordVisibility.oldPassword ? (
                  <EyeTwoTone
                  style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("oldPassword")}
                  />
                ) : (
                  <EyeInvisibleOutlined
                  style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("oldPassword")}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input
              type={passwordVisibility.newPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              suffix={
                passwordVisibility.newPassword ? (
                  <EyeTwoTone
                    style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("newPassword")}
                  />
                ) : (
                  <EyeInvisibleOutlined
                  style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("newPassword")}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ]}
          >
            <Input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              suffix={
                passwordVisibility.confirmPassword ? (
                  <EyeTwoTone
                  style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("confirmPassword")}
                  />
                ) : (
                  <EyeInvisibleOutlined
                  style={{marginLeft: "40px"}}
                    onClick={() => handleVisibilityToggle("confirmPassword")}
                  />
                )
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-100"
              style={{ borderRadius: "5px" }}
            >
              Đổi Mật Khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
