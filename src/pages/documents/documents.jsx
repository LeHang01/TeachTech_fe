import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, ListGroup, Alert } from 'react-bootstrap';
import { FaFileUpload } from 'react-icons/fa'; // Biểu tượng upload
import './documents.css'; // Tùy chỉnh CSS cho giao diện đẹp

const UploadDocuments = () => {
  const [documents, setDocuments] = useState([]); // Danh sách tài liệu đã tải lên
  const [newDocument, setNewDocument] = useState(null); // Tài liệu mới tải lên
  const [error, setError] = useState(''); // Lỗi tải tài liệu
  const [success, setSuccess] = useState(''); // Thành công tải tài liệu

  // Hàm xử lý tải tài liệu lên
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewDocument(file);
    }
  };

  // Hàm xử lý tải tài liệu vào danh sách
  const handleUploadSubmit = () => {
    if (!newDocument) {
      setError('Vui lòng chọn tài liệu để tải lên!');
      return;
    }

    setDocuments([...documents, newDocument]);
    setNewDocument(null);
    setSuccess('Tải tài liệu thành công!');
    setError('');
  };

  // Hàm gửi tài liệu cho lớp học
  const handleSendToClass = (doc, index) => {
    // Xử lý gửi tài liệu cho lớp học (ví dụ: gửi qua email hoặc API)
    alert(`Tài liệu "${doc.name}" đã được gửi cho lớp học!`);

    // Sau khi gửi, xóa tài liệu khỏi danh sách
    setDocuments(documents.filter((d, i) => i !== index));
  };

  return (
    <Container fluid className="upload-documents">
      <Row>
        {/* Card tải tài liệu lên */}
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Tải tài liệu lên</Card.Title>
              <Form>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Button
                  variant="primary"
                  onClick={handleUploadSubmit}
                  disabled={!newDocument}
                  className="w-100"
                >
                  <FaFileUpload /> Tải lên
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Danh sách tài liệu đã tải lên */}
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Danh sách tài liệu đã tải lên</Card.Title>
              <ListGroup>
                {documents.length === 0 ? (
                  <Alert variant="info">Chưa có tài liệu nào được tải lên</Alert>
                ) : (
                  documents.map((doc, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{doc.name}</span>
                        <div className="d-flex ms-auto">
                          {/* Nút xóa tài liệu */}
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              setDocuments(documents.filter((d, i) => i !== index));
                            }}
                            className="me-2"
                          >
                            Xóa
                          </Button>

                          {/* Nút gửi tài liệu */}
                          <Button
                            variant="outline-success"
                            onClick={() => handleSendToClass(doc, index)} // Truyền tài liệu và chỉ số
                          >
                            Gửi
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadDocuments;
