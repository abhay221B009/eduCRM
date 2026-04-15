import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchCourses, fetchEnrollments } from "../api/dashboardApi";
import type { Course } from "../api/dashboardApi";

const FacultyInfo: React.FC = () => {
  const { user } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignedFaculty = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const studentId = Number(user.id);
        const [courses, enrollments] = await Promise.all([
          fetchCourses(),
          fetchEnrollments(),
        ]);

        const studentEnrollments = enrollments.filter(
          (enrollment) =>
            enrollment.studentId === studentId &&
            enrollment.status === "approved",
        );
        const courseIds = new Set(
          studentEnrollments.map((enrollment) => enrollment.courseId),
        );
        const filteredCourses = courses.filter((course) =>
          courseIds.has(course.id),
        );

        setAssignedCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to load faculty information", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssignedFaculty();
  }, [user]);

  const instructorContact = (instructor: string) => {
    return `${instructor.toLowerCase().replace(/\s+/g, ".")}@educrm.com`;
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assigned Faculty</h2>
          <p className="text-gray-600">
            View the faculty members teaching your enrolled subjects.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {assignedCourses.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                No assigned faculty found yet. Enroll in a subject to see your
                professor.
              </p>
            </div>
          ) : (
            assignedCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500">{course.department}</p>
                  </div>
                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    {course.instructor}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Faculty contact</p>
                    <p className="mt-1 text-gray-900">
                      {instructorContact(course.instructor)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Subject status</p>
                    <p className="mt-1 text-gray-900">
                      {course.status === "active" ? "Active" : "Archived"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyInfo;
