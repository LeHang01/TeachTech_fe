import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const VerifyImage = () => {
  const { meetingId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Vui lòng để mặt vào khung hình');
  const [capturedFrames, setCapturedFrames] = useState([]);
  const streamRef = useRef(null);
  const [showRescanButton, setShowRescanButton] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // Thông tin user từ backend
  const [showCheckInButton, setShowCheckInButton] = useState(false); // Hiển thị nút "Điểm danh"
  const formatDate = (dateString) => moment(dateString).format('DD/MM/YYYY');
  const [borderColor, setBorderColor] = useState('green');

  // Mở webcam khi component được mount
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Lưu MediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('Vui lòng để mặt vào khung hình');
      } catch (error) {
        console.error('Error accessing webcam: ', error);
        setStatus('Không thể truy cập webcam. Vui lòng kiểm tra quyền hoặc thiết bị.');
      }
    };
    startWebcam();
    // Dừng webcam khi component bị unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        console.log('Webcam stopped');
      }
    };
  }, []);

  // Load mô hình nhận diện khuôn mặt khi component được mount
  useEffect(() => {
    const loadFaceApiModels = async () => {
      setStatus('Đang tải mô hình...');
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setStatus('Mô hình đã tải xong! Vui lòng để mặt vào khung hình');
      } catch (error) {
        setStatus('Lỗi tải mô hình, vui lòng thử lại.');
      }
    };
    loadFaceApiModels();
  }, []);

  // Hàm kiểm tra xem khuôn mặt có trong khung hình không
  const checkFaceInFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return false;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return false;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log('Detections:', detections);
      if (detections && detections.length > 0) {
        console.log(
          `Face detected with bounding box: ${JSON.stringify(detections[0].detection.box)}`,
        );
        setStatus('Khuôn mặt đã vào khung! Đang chụp ảnh...');
        setBorderColor('green');
        return true;
      } else {
        console.log('No face detected');
        setStatus('Vui lòng để mặt vào khung hình');
        setBorderColor('red');
        return false;
      }
    } catch (error) {
      console.error('Error detecting face:', error);
      setStatus('Lỗi nhận diện khuôn mặt');
      return false;
    }
  };

  // Hàm chụp ảnh tự động khi khuôn mặt đã vào khung
  const capturePhoto = async (video, canvas) => {
    console.log('Starting photo capture...');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/png');
    setCapturedFrames((prevFrames) => {
      const newFrames = [...prevFrames, imageUrl];

      // Nếu đã đủ 1 ảnh, cập nhật trạng thái
      if (newFrames.length === 1) {
        setStatus('');
        sendCapturedImagesToAPI(newFrames); // Gửi ảnh khi đủ 5 ảnh
      }
      return newFrames;
    });
  };

  // Hàm gửi ảnh và user_id đến API
  const sendCapturedImagesToAPI = async (capturedFrames) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const user_id = parseInt(userData.id, 10); // Chuyển user_id thành số nguyên
      const meetingIdParsed = parseInt(meetingId, 10); // Chuyển meetingId thành số nguyên
      console.log('user_id',user_id)
      console.log('meetingIdParsed', meetingIdParsed)
      const response = await axios.post('http://127.0.0.1:8000/api/faces/recognize/', {
        meetingId: meetingIdParsed,
        user_id: user_id,
        images: capturedFrames, // Mảng base64 của ảnh
      });

      if (parseInt(response.data.user_id, 10) === parseInt(user_id, 10)) {
        // Xử lý nếu trùng khớp
        setUserInfo(response.data);
        setShowCheckInButton(true);

        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach((track) => track.stop());
        }
        localStorage.setItem('faceScanCompleted', 'true');
        setStatus('Xác nhận thành công');
      } else {
        setStatus('Nhận diện thất bại!   ');
        setBorderColor('red');
        setShowRescanButton(true);
      }
    } catch (error) {
      setStatus('Nhận diện thất bại!   ');
        setBorderColor('red');
        setShowRescanButton(true);
    }
  };

  // Kiểm tra khuôn mặt mỗi 500ms
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      if (capturedFrames.length >= 1) {
        clearInterval(checkInterval);
        return; // Ngừng kiểm tra nếu đã đủ ảnh
      }
      const faceInFrame = await checkFaceInFrame();
      if (faceInFrame && capturedFrames.length < 1) {
        capturePhoto(videoRef.current, canvasRef.current);
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, [capturedFrames]);
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // Lưu MediaStream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus('Vui lòng để mặt vào khung hình');
    } catch (error) {
      console.error('Error accessing webcam: ', error);
      setStatus('Không thể truy cập webcam. Vui lòng kiểm tra quyền hoặc thiết bị.');
    }
  };
  const handleRescan = () => {
    setShowRescanButton(false);
    setCapturedFrames([]); // Reset the captured frames
    setStatus('Vui lòng để mặt vào khung hình'); // Reset status
    startWebcam(); // Start the webcam again
  };
  const handleCheckIn = () => {
    alert('Điểm danh thành công!');
  };
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {/* Tiêu đề */}
      <h1
        style={{
          color: 'white',
          marginRight: userInfo ? '405px' : '0',
          transition: 'margin-right 0.3s ease',
        }}
      >
        Điểm danh
      </h1>

      {/* Bố cục Video và Thông tin */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
        }}
      >
        {/* Video */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: '640px',
              height: '480px',
              border: '1px solid #ccc',
              borderRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              border: `5px solid ${borderColor}`,
              borderRadius: '50%',
              width: '350px',
              height: '390px',
              pointerEvents: 'none',
              background: 'transparent',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '20px',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            {status}
            {showRescanButton && (
              <button
                onClick={handleRescan}
                style={{
                  marginTop: '20px',
                  fontSize: '16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
              >
                Quét lại
              </button>
            )}
          </div>
        </div>

        {/* Thông tin người dùng */}
        {userInfo && (
          <div
            style={{
              border: '1px solid white',
              color: 'white',
              maxWidth: '400px',
              textAlign: 'left',
              backgroundColor: '#333',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#00ffa1' }}>
              Thông tin người dùng
            </h2>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: 'white',
              }}
            >
              <tbody>
                <tr>
                  <td style={cellStyle}>Họ tên:</td>
                  <td style={valueStyle}>{userInfo.full_name}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Ngày sinh:</td>
                  <td style={valueStyle}>{formatDate(userInfo.birth_date)}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Giới tính:</td>
                  <td style={valueStyle}>{userInfo.gender}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Số điện thoại:</td>
                  <td style={valueStyle}>{userInfo.phone_number}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Địa chỉ:</td>
                  <td style={valueStyle}>{userInfo.address}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Khóa học:</td>
                  <td style={valueStyle}>{userInfo.course}</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Ngày thanh toán:</td>
                  <td style={valueStyle}>{formatDate(userInfo.payment_date)}</td>
                </tr>
              </tbody>
            </table>
            {showCheckInButton && (
              <button
                onClick={handleCheckIn}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  fontSize: '16px',
                  backgroundColor: '#FE5D37',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#FE5D37')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#FE5D37')}
              >
                Điểm danh
              </button>
            )}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

const cellStyle = {
  padding: '10px 10px',
  borderBottom: '1px solid #444',
  textAlign: 'left',
  fontWeight: 'bold',
  width: '190px',
};

const valueStyle = {
  width: '10px 20px 0px 40px',
  borderBottom: '1px solid #444',
  textAlign: 'left',
};

export default VerifyImage;
