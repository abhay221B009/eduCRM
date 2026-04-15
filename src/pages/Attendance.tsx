import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchStudentAttendance, fetchCourses } from "../api/dashboardApi";
import type { AttendanceRecord, Course } from "../api/dashboardApi";

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const studentId = Number(user.id);
        const [attendanceData, courseData] = await Promise.all([
          fetchStudentAttendance(studentId),
          fetchCourses(),
        ]);
        setAttendance(attendanceData);
        setCourses(courseData);
      } catch (error) {
        console.error("Failed to load attendance", error);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user]);

  const getCourseTitle = (courseId: number) => {
    return (
      courses.find((course) => course.id === courseId)?.title ??
      "Unknown course"
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Attendance Tracker
          </h2>
          <p className="text-gray-600">
            Track subject-wise attendance and receive low attendance warnings.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {attendance.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                No attendance records available yet.
              </p>
            </div>
          ) : (
            attendance.map((record) => {
              const percent = record.total
                ? Math.round((record.attended / record.total) * 100)
                : 0;
              const isLow = percent < 75;
              return (
                <div
                  key={`${record.subjectId}-${record.attended}`}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getCourseTitle(record.subjectId)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {record.attended} / {record.total} classes attended
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        isLow
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {isLow && (
                    <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                      Low attendance warning: this subject is below 75%.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
