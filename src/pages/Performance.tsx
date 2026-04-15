import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchStudentResults, StudentResult } from "../api/dashboardApi";

const gradePoint = (grade: string) => {
  switch (grade) {
    case "A":
      return 10;
    case "A-":
      return 9;
    case "B+":
      return 8;
    case "B":
      return 7;
    case "B-":
      return 6;
    case "C":
      return 5;
    case "D":
      return 4;
    default:
      return 0;
  }
};

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchStudentResults(Number(user.id));
        setResults(data);
      } catch (error) {
        console.error("Failed to load performance data", error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [user]);

  const computeCgpa = (subjects: StudentResult["subjects"]) => {
    if (!subjects.length) return 0;
    const totalPoints = subjects.reduce(
      (acc: number, subject) => acc + gradePoint(subject.grade),
      0,
    );
    return Number((totalPoints / subjects.length).toFixed(2));
  };

  const latest = results[results.length - 1];
  const previous = results.length > 1 ? results[results.length - 2] : null;

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Academic Performance
          </h2>
          <p className="text-gray-600">
            View subject-wise marks, grades, and semester comparisons.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                No academic results available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    Latest semester
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {latest.semester}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    CGPA: {computeCgpa(latest.subjects)}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    Subject count
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {latest.subjects.length}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    Subjects graded in the latest semester.
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    Grade analytics
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {previous ? "Comparing" : "Keep improving"}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    Track your progress across semesters.
                  </p>
                </div>
              </div>

              {previous && (
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Semester Comparison
                  </h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 p-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {previous.semester}
                      </h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {computeCgpa(previous.subjects)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 p-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {latest.semester}
                      </h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {computeCgpa(latest.subjects)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Subject performance
                </h3>
                <div className="space-y-4">
                  {latest.subjects.map((subject) => (
                    <div
                      key={subject.subjectId}
                      className="rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {subject.subjectName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Grade: {subject.grade}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {subject.total}/100
                        </p>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${subject.total}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Performance;
