import type { Course, Enrollment, Student } from "../api/dashboardApi";

interface StudentsTableProps {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  onManageEnrollments: (student: Student) => void;
}

const statusStyles = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const StudentsTable = ({
  students,
  courses,
  enrollments,
  onManageEnrollments,
}: StudentsTableProps) => {
  const enrollmentForStudent = (studentId: number) =>
    enrollments.filter((e) => e.studentId === studentId);

  const getCourseById = (id: number) =>
    courses.find((course) => course.id === id);

  const getPassFailLabel = (scores: number[]) => {
    if (!scores || scores.length < 2) return "Incomplete";
    const average = scores.reduce((acc, s) => acc + s, 0) / scores.length;
    return average >= 50 ? "Pass" : "Fail";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Students</h2>
        <p className="text-sm text-gray-500">
          Manage your student roster and enrollment status.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const enrollmentsForStudent = enrollmentForStudent(student.id);
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {enrollmentsForStudent.length === 0 && (
                        <span className="text-xs text-gray-500">
                          No courses
                        </span>
                      )}
                      {enrollmentsForStudent.map((enrollment) => {
                        const course = getCourseById(enrollment.courseId);
                        const label = getPassFailLabel(enrollment.scores);
                        return (
                          <span
                            key={`${student.id}-${enrollment.courseId}`}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              label === "Pass"
                                ? "bg-green-100 text-green-700"
                                : label === "Fail"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {course?.title ?? "Unknown"} • {label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles(
                        student.status,
                      )}`}
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => onManageEnrollments(student)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
