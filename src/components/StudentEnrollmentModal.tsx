import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Course, Enrollment, Student } from "../api/dashboardApi";

interface StudentEnrollmentModalProps {
  student: Student;
  courses: Course[];
  enrollments: Enrollment[];
  onClose: () => void;
  onRegisterCourse: (courseId: number) => void;
  onUpdateScores: (courseId: number, scores: number[]) => void;
  onUpdateEnrollmentStatus: (
    courseId: number,
    status: "approved" | "rejected",
  ) => void;
}

const StudentEnrollmentModal = ({
  student,
  courses,
  enrollments,
  onClose,
  onRegisterCourse,
  onUpdateScores,
  onUpdateEnrollmentStatus,
}: StudentEnrollmentModalProps) => {
  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((e) => e.courseId)),
    [enrollments],
  );

  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    availableCourses[0]?.id,
  );

  const [scoresByCourse, setScoresByCourse] = useState<
    Record<number, [number, number]>
  >({});

  useEffect(() => {
    const initial: Record<number, [number, number]> = {};
    enrollments.forEach((enrollment) => {
      initial[enrollment.courseId] = [
        enrollment.scores[0] ?? 0,
        enrollment.scores[1] ?? 0,
      ];
    });
    setScoresByCourse(initial);
  }, [enrollments]);

  const computeResult = (scores: number[]) => {
    if (!scores || scores.length < 2) return "Incomplete";
    const avg = scores.reduce((acc, s) => acc + s, 0) / scores.length;
    return avg >= 50 ? "Pass" : "Fail";
  };

  const handleScoreChange = (courseId: number, index: 0 | 1, value: number) => {
    setScoresByCourse((prev) => {
      const current = prev[courseId] ?? [0, 0];
      const updated: [number, number] = [...current] as [number, number];
      updated[index] = value;
      return {
        ...prev,
        [courseId]: updated,
      };
    });
  };

  const handleSaveScores = (courseId: number) => {
    const scores = scoresByCourse[courseId] ?? [0, 0];
    onUpdateScores(courseId, scores);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Enrollment
            </h3>
            <p className="text-sm text-gray-600">
              {student.name} ({student.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Register new course
                </h4>
                <p className="text-xs text-gray-500">
                  Select a course and register the student.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!selectedCourseId}
                  onClick={() =>
                    selectedCourseId && onRegisterCourse(selectedCourseId)
                  }
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
                >
                  Register
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Course scores
            </h4>
            <p className="text-xs text-gray-500">
              Enter two exam scores to determine pass/fail status.
            </p>

            <div className="mt-4 space-y-4">
              {enrollments.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  This student is not enrolled in any courses yet.
                </div>
              ) : (
                enrollments.map((enrollment) => {
                  const course = courses.find(
                    (c) => c.id === enrollment.courseId,
                  );
                  const scores = scoresByCourse[enrollment.courseId] ?? [0, 0];
                  const result = computeResult(scores);
                  return (
                    <div
                      key={enrollment.courseId}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {course?.title ?? "Unknown course"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course?.department ?? ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              result === "Pass"
                                ? "bg-green-100 text-green-700"
                                : result === "Fail"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {result}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              enrollment.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : enrollment.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {enrollment.status.charAt(0).toUpperCase() +
                              enrollment.status.slice(1)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveScores(enrollment.courseId)
                            }
                            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          {enrollment.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateEnrollmentStatus(
                                    enrollment.courseId,
                                    "approved",
                                  )
                                }
                                className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateEnrollmentStatus(
                                    enrollment.courseId,
                                    "rejected",
                                  )
                                }
                                className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <label className="flex flex-col text-xs font-semibold text-gray-700">
                          Exam 1 score
                          <input
                            type="number"
                            value={scores[0]}
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleScoreChange(
                                enrollment.courseId,
                                0,
                                Number(e.target.value),
                              )
                            }
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </label>
                        <label className="flex flex-col text-xs font-semibold text-gray-700">
                          Exam 2 score
                          <input
                            type="number"
                            value={scores[1]}
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleScoreChange(
                                enrollment.courseId,
                                1,
                                Number(e.target.value),
                              )
                            }
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentModal;
