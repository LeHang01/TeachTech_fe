import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './class.css';

const LopHocTrucTuyen = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Nguyễn Thị Lan Anh', status: 'Chưa điểm danh' },
    { id: 2, name: 'Trần Minh Ân', status: 'Chưa điểm danh' },
    { id: 3, name: 'Lê Quang Dương', status: 'Chưa điểm danh' },
    { id: 4, name: 'Phạm Thị Lan Giang', status: 'Chưa điểm danh' },
    { id: 5, name: 'Ngô Đức Hoàng', status: 'Chưa điểm danh' },
    { id: 6, name: 'Bùi Thanh Hùng', status: 'Chưa điểm danh' },
    { id: 7, name: 'Vũ Thị Minh', status: 'Chưa điểm danh' },
    { id: 8, name: 'Đặng Minh Nam', status: 'Chưa điểm danh' },
    { id: 9, name: 'Mai Thị Khương', status: 'Chưa điểm danh' },
    { id: 10, name: 'Trần Hoàng Loan', status: 'Chưa điểm danh' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [reason, setReason] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // Đếm ngược từ 15 phút (900 giây)
  const navigate = useNavigate();

  // Hàm xử lý khi điểm danh
  const handleStatusChange = (id, newStatus) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student,
      ),
    );
    setEditingId(null);
  };

  // Hàm xử lý lý do vắng
  const handleReasonSubmit = (id) => {
    if (reason.trim() === '') {
      alert('Vui lòng nhập lý do vắng!');
      return;
    }
    handleStatusChange(id, `Vắng có lý do: ${reason}`);
    setReason('');
  };

  // Hàm xử lý khi điểm danh
  const handlePointDanh = (id) => {
    handleStatusChange(id, 'Đã điểm danh');
    navigate('/attendance');
  };

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="xx py-5">
      <div className="classs">
        {/* Đồng hồ đếm ngược */}
        <div className="text-center mb-4">
          <h2>Đồng hồ đếm ngược</h2>
          <div className="countdown-timer">
            <p>{formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Danh sách học viên */}
        <div className="text-center mb-4">
          <h1>Danh sách học viên</h1>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>
                  {editingId === student.id ? (
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Nhập lý do"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleReasonSubmit(student.id)}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={
                          student.status.includes('Vắng không lý do')
                            ? 'status-vang'
                            : student.status.includes('Vắng có lý do')
                            ? 'status-vang-ly-do'
                            : ''
                        }
                      >
                        {student.status}
                      </span>
                      {student.name === 'Trần Minh Ân' && student.status === 'Chưa điểm danh' && (
                        <div className="dropdown mt-2">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id={`dropdownMenu-${student.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Thay đổi
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenu-${student.id}`}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handlePointDanh(student.id)}
                              >
                                Điểm danh
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setEditingId(student.id)}
                              >
                                Vắng có lý do
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(student.id, 'Vắng không lý do')}
                              >
                                Vắng không lý do
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LopHocTrucTuyen;
