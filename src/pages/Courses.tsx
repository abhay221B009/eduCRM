import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CoursesTable from "../components/CoursesTable";
import {
  fetchCourses,
  fetchEnrollments,
  registerStudentToCourse,
  Course,
  Enrollment,
} from "../api/dashboardApi";
import { Loader2 } from "lucide-react";

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingCourseId, setApplyingCourseId] = useState<number | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        const [coursesData, enrollmentData] = await Promise.all([
          fetchCourses(),
          ...(user?.role === "student"
            ? [fetchEnrollments()]
            : [Promise.resolve([] as Enrollment[])]),
        ]);
        setCourses(coursesData);
        setEnrollments(user?.role === "student" ? enrollmentData : []);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [user]);

  const handleApplyCourse = async (courseId: number) => {
    if (!user || user.role !== "student") return;
    setApplyingCourseId(courseId);
    try {
      const updated = await registerStudentToCourse(Number(user.id), courseId);
      setEnrollments(
        updated.filter(
          (enrollment) => enrollment.studentId === Number(user.id),
        ),
      );
    } catch (error) {
      console.error("Failed to apply for course", error);
    } finally {
      setApplyingCourseId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-600">
            Browse courses and request enrollment in subjects.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <CoursesTable
          courses={courses}
          userRole={user?.role}
          enrollments={enrollments}
          onApplyCourse={handleApplyCourse}
          applyingCourseId={applyingCourseId}
        />
      )}
    </div>
  );
};

export default Courses;
