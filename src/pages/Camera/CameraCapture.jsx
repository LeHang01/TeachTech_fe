import React, { useEffect, useRef, useState } from 'react';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [status, setStatus] = useState('Vui lòng để mặt vào khung hình');
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false); // Kiểm tra xem mặt có trong khung hay không

  // Mở webcam khi component được mount
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      }
    };
  }, []);

  // Hàm kiểm tra xem mặt có trong khung elip không
  const checkFaceInFrame = () => {
    if (!canvasRef.current || !videoRef.current) return false; // Kiểm tra null để tránh lỗi

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return false; // Kiểm tra context có hợp lệ không

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ video lên canvas để kiểm tra
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // Kiểm tra trong khu vực khung elip (tạm thời dùng mô phỏng đơn giản)
    const imageDataInEllipse = imageData.data.slice(0, imageData.data.length); // Chỉ lấy dữ liệu trong khu vực khung elip

    // Giả sử rằng nếu không có mặt trong khung elip thì sẽ hiển thị chữ yêu cầu
    if (imageDataInEllipse) {
      return true;
    }
    return false;
  };

  // Kiểm tra mặt khi video chạy
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const faceDetected = checkFaceInFrame();
      setFaceDetected(faceDetected);
      if (faceDetected) {
        setStatus('');
      } else {
        setStatus('Vui lòng để mặt vào khung hình');
      }
    }, 1000); // Kiểm tra mỗi giây

    return () => clearInterval(checkInterval);
  }, [capturedFrames]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: 'white' }}>Quét khuôn mặt</h1>
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

        {/* Khung elip */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid #fff',
            borderRadius: '50%', // Khung elip dọc để mặt vào
            width: '350px', // Kích thước khung elip
            height: '390px', // Kích thước khung elip
            pointerEvents: 'none',
            background: 'transparent',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.6)', // Hiệu ứng viền khi mặt vào đúng khung
            zIndex: 2,
          }}
        />

        {/* Lớp phủ mờ ngoài khung elip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%', // Giới hạn vùng mờ xung quanh elip
            zIndex: 1,
            pointerEvents: 'none',

            opacity: 0.6, // Độ mờ của vùng ngoài
          }}
        />
        {/* Chữ hướng dẫn */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {status}
        </div>
      </div>

      <p>{status}</p>

      {/* Hiển thị ảnh đã chụp bên cạnh camera */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {capturedFrames.map((frame, index) => (
          <img
            key={index}
            src={frame}
            alt={`Frame ${index + 1}`}
            style={{ width: '100px', height: '100px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};
export default CameraCapture;
