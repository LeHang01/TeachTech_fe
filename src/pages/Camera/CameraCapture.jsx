import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Vui lòng để mặt vào khung hình');
  const [capturedFrames, setCapturedFrames] = useState([]);
  const streamRef = useRef(null);
  const navigate = useNavigate();

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
        return true;
      } else {
        console.log('No face detected');
        setStatus('Vui lòng để mặt vào khung hình');
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
    console.log('Captured photo URL:', imageUrl);
    setCapturedFrames((prevFrames) => {
      const newFrames = [...prevFrames, imageUrl];

      // Nếu đã đủ 1 ảnh, cập nhật trạng thái
      if (newFrames.length === 1) {
        setStatus('Bạn đã chụp thành công ảnh!');
        sendCapturedImagesToAPI(newFrames); // Gửi ảnh khi đủ  ảnh
      }
      return newFrames;
    });
  };

  // Hàm gửi ảnh và user_id đến API
  const sendCapturedImagesToAPI = async (capturedFrames) => {
    try {
      const user_id = localStorage.getItem('user_id');
      const reponse = await axios.post('http://127.0.0.1:8000/api/faces/record/', {
        user_id: user_id,
        images: capturedFrames, // Mảng base64 của các ảnh
      });
      console.log('reponse', reponse);
      if (reponse.status === 200) {
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach((track) => track.stop());
        }
        localStorage.setItem('faceScanCompleted', 'true');
        setStatus('Ghi nhận ảnh thành công');
        setTimeout(() => {
          navigate('/registration-success');
        }, 3000); // Dừng 3 giây (3000ms)
      }
    } catch (error) {
      console.error('Error sending images to API:', error);
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

  const borderColor = 'green';

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
          }}
        >
          {status}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
