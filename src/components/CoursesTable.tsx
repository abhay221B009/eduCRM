import { MoreVertical } from "lucide-react";
import type { Enrollment } from "../api/dashboardApi";

interface Course {
  id: number;
  title: string;
  department: string;
  credits: number;
  instructor: string;
  status: "active" | "archived";
}

interface CoursesTableProps {
  courses: Course[];
  userRole?: string;
  enrollments?: Enrollment[];
  onApplyCourse?: (courseId: number) => void;
  applyingCourseId?: number | null;
}

const statusStyles = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "archived":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const enrollmentStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CoursesTable = ({
  courses,
  userRole,
  enrollments = [],
  onApplyCourse,
  applyingCourseId,
}: CoursesTableProps) => {
  const getEnrollment = (courseId: number) =>
    enrollments.find((enrollment) => enrollment.courseId === courseId);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
        <p className="text-sm text-gray-500">
          Browse and request enrollment in available subjects.
        </p>
      </div>
      <div className="overflow-x-auto">
        {courses.length === 0 ? (
          <div className="rounded-b-xl bg-white p-10 text-center text-sm text-gray-500">
            No courses are available right now.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => {
                const enrollment = getEnrollment(course.id);
                const isStudent = userRole === "student";
                const isApplying = applyingCourseId === course.id;
                return (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-[11px] font-semibold rounded-full ${statusStyles(
                            course.status,
                          )}`}
                        >
                          {course.status.charAt(0).toUpperCase() +
                            course.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.credits}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment ? (
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${enrollmentStatusStyles(
                            enrollment.status,
                          )}`}
                        >
                          {enrollment.status.charAt(0).toUpperCase() +
                            enrollment.status.slice(1)}
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isStudent ? (
                        <button
                          type="button"
                          disabled={
                            !!enrollment ||
                            course.status !== "active" ||
                            isApplying
                          }
                          onClick={() => onApplyCourse?.(course.id)}
                          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-semibold text-white shadow-sm transition ${
                            enrollment
                              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                              : course.status !== "active"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {enrollment
                            ? enrollment.status === "pending"
                              ? "Pending"
                              : enrollment.status === "approved"
                                ? "Approved"
                                : "Rejected"
                            : isApplying
                              ? "Applying..."
                              : "Apply"}
                        </button>
                      ) : (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesTable;
