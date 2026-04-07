import React, { useState, useEffect } from 'react';

const AttendancePage = ({ classId, sectionId, sessionId }) => {
    // 1. Fetch Data
    const { data: students, isLoading } = fetchstudentListQuery({ classId, sectionId, sessionId });
    const { mutate: markBulkAttendance, isLoading: isUpdating } = markAttendanceMutation();

    // 2. Local State to manage edits before saving
    const [attendanceMap, setAttendanceMap] = useState({});

    // Sync local state when data loads
    useEffect(() => {
        if (students?.data) {
            const initialMap = {};
            students.data.forEach(s => {
                initialMap[s.id] = s.status || 'present'; // Default to present
            });
            setAttendanceMap(initialMap);
        }
    }, [students]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    const handleMarkAll = (status) => {
        const updated = {};
        Object.keys(attendanceMap).forEach(id => updated[id] = status);
        setAttendanceMap(updated);
    };

    const handleSubmit = () => {
        const payload = Object.entries(attendanceMap).map(([id, status]) => ({
            studentId: id,
            status,
            date: new Date().toISOString().split('T')[0]
        }));
        markBulkAttendance({ attendance: payload });
    };

    if (isLoading) return <div>Loading Students...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mark Attendance</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => handleMarkAll('present')}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                        Mark All Present
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isUpdating ? 'Saving...' : 'Save Attendance'}
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="p-4 text-left">Roll No</th>
                        <th className="p-4 text-left">Student Name</th>
                        <th className="p-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students?.data.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{student.rollNumber}</td>
                            <td className="p-4 font-medium">{student.name}</td>
                            <td className="p-4">
                                <div className="flex justify-center gap-2">
                                    {['present', 'absent', 'late'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(student.id, status)}
                                            className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${attendanceMap[student.id] === status
                                                ? getStatusColor(status)
                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper for UI colors
const getStatusColor = (status) => {
    switch (status) {
        case 'present': return 'bg-green-500 text-white';
        case 'absent': return 'bg-red-500 text-white';
        case 'late': return 'bg-yellow-500 text-white';
        default: return 'bg-gray-200';
    }
};

export default AttendancePage;