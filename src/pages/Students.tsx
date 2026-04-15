import React, { useEffect, useMemo, useState } from "react";
import StudentsTable from "../components/StudentsTable";
import StudentEnrollmentModal from "../components/StudentEnrollmentModal";
import {
  fetchCourses,
  fetchEnrollments,
  fetchStudents,
  registerStudentToCourse,
  updateEnrollmentScores,
  updateEnrollmentStatus,
  Course,
  Enrollment,
  Student,
} from "../api/dashboardApi";
import { Loader2 } from "lucide-react";

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [studentsData, coursesData, enrollmentsData] = await Promise.all([
        fetchStudents(),
        fetchCourses(),
        fetchEnrollments(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error("Failed to load student page data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleManageEnrollments = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleRegisterCourse = async (courseId: number) => {
    if (!selectedStudent) return;

    const updated = await registerStudentToCourse(selectedStudent.id, courseId);
    setEnrollments(updated);
  };

  const handleUpdateScores = async (courseId: number, scores: number[]) => {
    if (!selectedStudent) return;

    const updated = await updateEnrollmentScores(
      selectedStudent.id,
      courseId,
      scores,
    );
    setEnrollments(updated);
  };

  const handleUpdateEnrollmentStatus = async (
    courseId: number,
    status: "approved" | "rejected",
  ) => {
    if (!selectedStudent) return;

    const updated = await updateEnrollmentStatus(
      selectedStudent.id,
      courseId,
      status,
    );
    setEnrollments(updated);
  };

  const currentEnrollments = useMemo(() => {
    if (!selectedStudent) return [];
    return enrollments.filter((e) => e.studentId === selectedStudent.id);
  }, [enrollments, selectedStudent]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600">
            View and manage all registered students.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <StudentsTable
          students={students}
          courses={courses}
          enrollments={enrollments}
          onManageEnrollments={handleManageEnrollments}
        />
      )}

      {modalOpen && selectedStudent && (
        <StudentEnrollmentModal
          student={selectedStudent}
          courses={courses}
          enrollments={currentEnrollments}
          onClose={handleCloseModal}
          onRegisterCourse={handleRegisterCourse}
          onUpdateScores={handleUpdateScores}
          onUpdateEnrollmentStatus={handleUpdateEnrollmentStatus}
        />
      )}
    </div>
  );
};

export default Students;
