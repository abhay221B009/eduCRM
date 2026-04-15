import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCard from "./StatsCard";
import AdmissionsTable from "./AdmissionsTable";
import QueriesPanel from "./QueriesPanel";
import { Outlet, useLocation } from "react-router-dom";
import {
  fetchStats,
  fetchAdmissions,
  fetchQueries,
  fetchEnrollments,
  fetchCourses,
  fetchStudentResults,
  fetchStudentAttendance,
  QueryItem,
} from "../api/dashboardApi";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface StatItem {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

interface Admission {
  id: number;
  name: string;
  email: string;
  course: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

type Query = QueryItem;

interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  active: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Generate navigation based on user role
  const generateNavigation = (role: string): NavigationItem[] => {
    switch (role) {
      case "admin":
        return [
          {
            id: 1,
            name: "Dashboard",
            icon: "LayoutDashboard",
            path: "/",
            active: false,
          },
          {
            id: 2,
            name: "Students",
            icon: "Users",
            path: "/students",
            active: false,
          },
          {
            id: 3,
            name: "Admissions",
            icon: "UserPlus",
            path: "/admissions",
            active: false,
          },
          {
            id: 4,
            name: "Courses",
            icon: "BookOpen",
            path: "/courses",
            active: false,
          },
          {
            id: 5,
            name: "Faculty",
            icon: "UserCheck",
            path: "/faculty",
            active: false,
          },
          {
            id: 6,
            name: "Queries",
            icon: "MessageSquare",
            path: "/queries",
            active: false,
          },
          {
            id: 7,
            name: "Reports",
            icon: "BarChart3",
            path: "/reports",
            active: false,
          },
          {
            id: 8,
            name: "Settings",
            icon: "Settings",
            path: "/settings",
            active: false,
          },
        ];
      case "faculty":
        return [
          {
            id: 1,
            name: "Dashboard",
            icon: "LayoutDashboard",
            path: "/",
            active: false,
          },
          {
            id: 2,
            name: "Students",
            icon: "Users",
            path: "/students",
            active: false,
          },
          {
            id: 3,
            name: "Courses",
            icon: "BookOpen",
            path: "/courses",
            active: false,
          },
          {
            id: 4,
            name: "Queries",
            icon: "MessageSquare",
            path: "/queries",
            active: false,
          },
          {
            id: 5,
            name: "Reports",
            icon: "BarChart3",
            path: "/reports",
            active: false,
          },
        ];
      case "student":
        return [
          {
            id: 1,
            name: "Dashboard",
            icon: "LayoutDashboard",
            path: "/",
            active: false,
          },
          {
            id: 2,
            name: "Courses",
            icon: "BookOpen",
            path: "/courses",
            active: false,
          },
          {
            id: 3,
            name: "Queries",
            icon: "MessageSquare",
            path: "/queries",
            active: false,
          },
          {
            id: 4,
            name: "Performance",
            icon: "BarChart3",
            path: "/performance",
            active: false,
          },
          {
            id: 5,
            name: "Attendance",
            icon: "Clock",
            path: "/attendance",
            active: false,
          },
          {
            id: 6,
            name: "Faculty",
            icon: "UserCheck",
            path: "/faculty-info",
            active: false,
          },
          {
            id: 7,
            name: "Notifications",
            icon: "Bell",
            path: "/notifications",
            active: false,
          },
        ];
      default:
        return [
          {
            id: 1,
            name: "Dashboard",
            icon: "LayoutDashboard",
            path: "/",
            active: false,
          },
        ];
    }
  };

  useEffect(() => {
    if (user) {
      const userNavigation = generateNavigation(user.role);
      // Update active state based on current location
      const updatedNavigation = userNavigation.map((item) => ({
        ...item,
        active: location.pathname.includes(item.name.toLowerCase()),
      }));
      setNavigation(updatedNavigation);
    }
  }, [user, location.pathname]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, admissionsData, queriesData] = await Promise.all([
          fetchStats(),
          fetchAdmissions(),
          fetchQueries(),
        ]);

        setStats(statsData);
        setAdmissions(admissionsData);
        setQueries(queriesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        navigation={navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          <LocationRenderer
            stats={stats}
            admissions={admissions}
            queries={queries}
          />
        </main>
      </div>
    </div>
  );
};

const LocationRenderer = ({
  stats,
  admissions,
  queries,
}: {
  stats: StatItem[];
  admissions: Admission[];
  queries: Query[];
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const isRoot = location.pathname === "/" || location.pathname === "";

  if (!isRoot) {
    return <Outlet />;
  }

  if (user?.role === "student") {
    return <StudentSummary />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => (
          <StatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdmissionsTable admissions={admissions} />
        </div>
        <div className="lg:col-span-1">
          <QueriesPanel queries={queries} />
        </div>
      </div>
    </>
  );
};

const StudentSummary = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<number>(0);
  const [pendingEnrollments, setPendingEnrollments] = useState<number>(0);
  const [attendance, setAttendance] = useState(0);
  const [cgpa, setCgpa] = useState(0);
  const [subjects, setSubjects] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);

  useEffect(() => {
    const loadStudentSummary = async () => {
      if (!user) return;
      const studentId = Number(user.id);
      const [allEnrollments, attendanceData, results, courses] =
        await Promise.all([
          fetchEnrollments(),
          fetchStudentAttendance(studentId),
          fetchStudentResults(studentId),
          fetchCourses(),
        ]);

      const studentEnrollments = allEnrollments.filter(
        (e) => e.studentId === studentId,
      );
      const approved = studentEnrollments.filter(
        (e) => e.status === "approved",
      );
      setEnrollments(studentEnrollments.length);
      setPendingEnrollments(
        studentEnrollments.filter((e) => e.status === "pending").length,
      );
      const totalSeatCount = attendanceData.reduce(
        (sum, record) => sum + record.total,
        0,
      );
      const totalAttended = attendanceData.reduce(
        (sum, record) => sum + record.attended,
        0,
      );
      setAttendance(
        totalSeatCount ? Math.round((totalAttended / totalSeatCount) * 100) : 0,
      );
      setSubjects(approved.length);
      setFacultyCount(
        new Set(
          approved.map((e) => {
            const course = courses.find((c) => c.id === e.courseId);
            return course?.instructor ?? "";
          }),
        ).size,
      );

      const latest = results[results.length - 1];
      if (latest) {
        const gradeMap: Record<string, number> = {
          A: 10,
          "A-": 9,
          "B+": 8,
          B: 7,
          "B-": 6,
          C: 5,
          D: 4,
          F: 0,
        };
        const totalPoints = latest.subjects.reduce(
          (sum, subject) => sum + (gradeMap[subject.grade] ?? 0),
          0,
        );
        setCgpa(
          latest.subjects.length
            ? Number((totalPoints / latest.subjects.length).toFixed(2))
            : 0,
        );
      }
    };

    loadStudentSummary();
  }, [user]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Semester Dashboard</h1>
        <p className="text-gray-600">
          Your current semester health and academic snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Current semester
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            Semester 2
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Stay focused on the current curriculum and pending approvals.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Enrolled subjects
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {subjects}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Approved subjects in your current semester.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Attendance
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {attendance}%
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Overall attendance across enrolled subjects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Academic performance
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-900">{cgpa}</p>
              <p className="text-sm text-gray-500">
                Estimated CGPA based on latest semester grades.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {user?.name}
            </span>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Faculty connections
          </h2>
          <p className="mt-4 text-3xl font-semibold text-gray-900">
            {facultyCount}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Faculty members teaching your enrolled subjects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pending enrollment
          </h3>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {pendingEnrollments}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Subjects awaiting approval from admin or faculty.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Course applications
          </h3>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {enrollments}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Total course requests submitted this semester.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Next step
          </h3>
          <p className="mt-3 text-lg font-semibold text-gray-900">
            Review courses and queries
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Keep your requests and questions up to date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
