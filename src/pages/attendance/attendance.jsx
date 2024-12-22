import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './attendance.css';  // Import the CSS file

const AttendancePage = () => {
    const { meetingId } = useParams(); // Get meeting ID from URL
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceStatus, setAttendanceStatus] = useState('Not Started'); // Track attendance status

    useEffect(() => {
        // Fetch meeting details
        const fetchMeetingDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/meetings/${meetingId}`);
                setMeeting(response.data);
                setAttendanceStatus(response.data.status);
                
            } catch (error) {
                message.error("Không thể tải thông tin cuộc họp");
            }
        };

        // Fetch students' attendance
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/attendance/${meetingId}`);
                setStudents(response.data); // Populate the students data with the attendance records
                console.log(response.data);
            } catch (error) {
                message.error("Không thể tải danh sách điểm danh");
            }
        };

        fetchMeetingDetails();
        fetchAttendance();
        setLoading(false);
    }, [meetingId]);

    const handleStartAttendance = async () => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/meetings/${meetingId}/update_meeting/`, { has_attended: "Đang điểm danh" });
            message.success("Bắt đầu điểm danh thành công!");
            const updatedStudents = students.map(student => ({
                ...student,
                has_attended: "Đang điểm danh"
            }));
            setStudents(updatedStudents);
        } catch (error) {
            message.error("Không thể bắt đầu điểm danh");
        }
    };

    const handleEndAttendance = async () => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/meetings/${meetingId}/update_meeting/`, { has_attended: "Đã điểm danh" });
            message.success("Kết thúc điểm danh thành công!");
            const updatedStudents = students.map(student => ({
                ...student,
                has_attended: "Đã điểm danh"
            }));
            setStudents(updatedStudents);
            // Sau khi cập nhật trạng thái, gọi lại API để lấy danh sách điểm danh mới nhất
            const response = await axios.get(`http://127.0.0.1:8000/api/attendance/${meetingId}`);
            setStudents(response.data); // Cập nhật danh sách điểm danh trong state
        } catch (error) {
            message.error("Không thể kết thúc điểm danh");
        }
    };
    const handleUpdateExcused = async (attendanceId) => {
        try {
            // Gọi API để cập nhật lý do vắng
            await axios.patch(`http://127.0.0.1:8000/api/attendance/${attendanceId}/update_reason/`, {
                absence_reason_type: "Chính đáng"
            });
            message.success("Cập nhật lý do vắng thành công!");
    
            // Cập nhật lại danh sách học viên trong state
            const updatedStudents = students.map(student => {
                if (student.attendance_id === attendanceId) {
                    return {
                        ...student,
                        absence_reason_type: "Chính đáng"
                    };
                }
                return student;
            });
            setStudents(updatedStudents);
        } catch (error) {
            message.error("Không thể cập nhật lý do vắng.");
        }
    };
    


    const columns = [
        {
            title: "Tên học viên",
            dataIndex: "student_name",
            key: "student_name",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            key: "dob",
            render: (dob) => {
                if (dob) {
                    const date = new Date(dob);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }
                return dob;
            }
        },
        {
            title: "Trạng thái điểm danh",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Thời gian điểm danh",
            dataIndex: "attendance_time",
            key: "attendance_time",
            render: (attendance_time) => {
                if (attendance_time) {
                    const time = new Date(attendance_time);
                    const hours = String(time.getHours()).padStart(2, '0');
                    const minutes = String(time.getMinutes()).padStart(2, '0');
                    const seconds = String(time.getSeconds()).padStart(2, '0');
                    return `${hours}:${minutes}:${seconds}`;
                }
                return "N/A"; // Hiển thị "N/A" nếu attendance_time không tồn tại
            }
        },        
        {
            title: "Lý do vắng",
            dataIndex: "absence_reason_type",
            key: "absence_reason_type",
            render: (text) => text ? text : "Không có"
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                record.status === "Vắng" && (record.absence_reason_type !== "Chính đáng") && (
                    <Button
                        type="primary"
                        onClick={() => handleUpdateExcused(record.attendance_id)}
                    >
                        Xác nhận có phép
                    </Button>
                )
            )
        }
        
    ];
    

    return (
        <div className="attendance-container">
            <h2 className="attendance-title">Điểm danh cuộc họp</h2>
            <Button
                onClick={() => navigate(-1)} // Navigate to the previous page
                style={{ marginBottom: 20 }}
            >
                Quay lại
            </Button>
            {attendanceStatus === "Đang diễn ra" && students.some(student => student.has_attended === "Chưa điểm danh") && (
                <Button
                    type="primary"
                    onClick={handleStartAttendance}
                    className="attendance-button"
                    disabled={students.every(student => student.has_attended !== "Chưa điểm danh")} // Disable button if all students have attended
                >
                    Bắt đầu điểm danh
                </Button>
            )}

            {attendanceStatus === "Đang diễn ra" && students.some(student => student.has_attended === "Đang điểm danh") && (
                <Button
                    type="danger"
                    onClick={handleEndAttendance}
                    className="attendance-button"
                >
                    Kết thúc điểm danh
                </Button>
            )}

            <Table
                columns={columns}
                dataSource={students}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default AttendancePage;
