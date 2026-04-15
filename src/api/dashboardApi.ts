export interface StatItem {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

export interface Admission {
  id: number;
  name: string;
  email: string;
  course: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  year: string;
  status: "active" | "inactive";
}

export interface Course {
  id: number;
  title: string;
  department: string;
  credits: number;
  instructor: string;
  status: "active" | "archived";
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "on leave" | "retired";
}

export type QueryCategory = "Admission" | "Fees" | "Academics" | "Technical";
export type QueryStatus =
  | "pending"
  | "in progress"
  | "resolved"
  | "new"
  | "replied";

export interface QueryReply {
  id: string;
  sender: "student" | "faculty" | "admin";
  message: string;
  createdAt: string;
}

export interface QueryItem {
  id: number;
  studentId?: number;
  category?: QueryCategory;
  subject: string;
  message: string;
  createdAt?: string;
  time?: string;
  status: QueryStatus;
  replies?: QueryReply[];
  name?: string;
}

export interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  active: boolean;
}

export interface ResultSubject {
  subjectId: number;
  subjectName: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
}

export interface StudentResult {
  id: number;
  studentId: number;
  semester: string;
  subjects: ResultSubject[];
}

export interface AttendanceRecord {
  studentId: number;
  subjectId: number;
  attended: number;
  total: number;
}

export interface Notification {
  id: number;
  studentId: number;
  title: string;
  message: string;
  type: "query" | "enrollment" | "marks" | "attendance";
  read: boolean;
  createdAt: string;
}

export interface Enrollment {
  studentId: number;
  courseId: number;
  scores: number[];
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export const fetchStats = (): Promise<StatItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Total Students",
          value: "2,847",
          change: "+12.5%",
          trend: "up",
          icon: "Users",
        },
        {
          id: 2,
          title: "New Admissions",
          value: "156",
          change: "+8.2%",
          trend: "up",
          icon: "UserPlus",
        },
        {
          id: 3,
          title: "Pending Queries",
          value: "43",
          change: "-3.1%",
          trend: "down",
          icon: "MessageSquare",
        },
      ]);
    }, 500);
  });
};

export const fetchAdmissions = (): Promise<Admission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Aarav Sharma",
          email: "aarav.sharma@email.com",
          course: "Computer Science",
          date: "2024-02-15",
          status: "approved",
        },
        {
          id: 2,
          name: "Ananya Verma",
          email: "ananya.verma@email.com",
          course: "Business Administration",
          date: "2024-02-14",
          status: "pending",
        },
        {
          id: 3,
          name: "Rohan Mehta",
          email: "rohan.mehta@email.com",
          course: "Data Science",
          date: "2024-02-14",
          status: "approved",
        },
        {
          id: 4,
          name: "Ishita Kapoor",
          email: "ishita.kapoor@email.com",
          course: "Engineering",
          date: "2024-02-13",
          status: "rejected",
        },
        {
          id: 5,
          name: "Karthik Reddy",
          email: "karthik.reddy@email.com",
          course: "Marketing",
          date: "2024-02-13",
          status: "pending",
        },
      ]);
    }, 600);
  });
};

export const fetchStudents = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Aarav Sharma",
          email: "aarav.sharma@email.com",
          course: "Computer Science",
          year: "Sophomore",
          status: "active",
        },
        {
          id: 2,
          name: "Ananya Verma",
          email: "ananya.verma@email.com",
          course: "Business Administration",
          year: "Freshman",
          status: "active",
        },
        {
          id: 3,
          name: "Rohan Mehta",
          email: "rohan.mehta@email.com",
          course: "Data Science",
          year: "Junior",
          status: "inactive",
        },
        {
          id: 4,
          name: "Ishita Kapoor",
          email: "ishita.kapoor@email.com",
          course: "Engineering",
          year: "Senior",
          status: "active",
        },
        {
          id: 5,
          name: "Karthik Reddy",
          email: "karthik.reddy@email.com",
          course: "Marketing",
          year: "Sophomore",
          status: "active",
        },
      ]);
    }, 600);
  });
};

export const fetchCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Introduction to Computer Science",
          department: "Computer Science",
          credits: 3,
          instructor: "Dr. Priya Reddy",
          status: "active",
        },
        {
          id: 2,
          title: "Principles of Marketing",
          department: "Business",
          credits: 3,
          instructor: "Prof. Arun Gupta",
          status: "active",
        },
        {
          id: 3,
          title: "Data Structures & Algorithms",
          department: "Computer Science",
          credits: 4,
          instructor: "Dr. Neha Singh",
          status: "active",
        },
        {
          id: 4,
          title: "Financial Accounting",
          department: "Business",
          credits: 3,
          instructor: "Dr. Rakesh Menon",
          status: "archived",
        },
        {
          id: 5,
          title: "Introduction to Psychology",
          department: "Social Sciences",
          credits: 3,
          instructor: "Dr. Shweta Rao",
          status: "active",
        },
      ]);
    }, 550);
  });
};

export const fetchFaculty = (): Promise<Faculty[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Dr. Priya Reddy",
          email: "priya.reddy@educrm.com",
          department: "Computer Science",
          role: "Professor",
          status: "active",
        },
        {
          id: 2,
          name: "Prof. Arun Gupta",
          email: "arun.gupta@educrm.com",
          department: "Business",
          role: "Associate Professor",
          status: "active",
        },
        {
          id: 3,
          name: "Dr. Neha Singh",
          email: "neha.singh@educrm.com",
          department: "Computer Science",
          role: "Assistant Professor",
          status: "on leave",
        },
        {
          id: 4,
          name: "Dr. Rakesh Menon",
          email: "rakesh.menon@educrm.com",
          department: "Business",
          role: "Professor",
          status: "active",
        },
        {
          id: 5,
          name: "Dr. Shweta Rao",
          email: "shweta.rao@educrm.com",
          department: "Social Sciences",
          role: "Professor",
          status: "active",
        },
      ]);
    }, 600);
  });
};

export const fetchQueries = (): Promise<QueryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadQueriesFromStorage());
    }, 550);
  });
};

export const fetchStudentQueries = (
  studentId: number,
): Promise<QueryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        loadQueriesFromStorage().filter(
          (query) => query.studentId === studentId,
        ),
      );
    }, 450);
  });
};

export const submitStudentQuery = (
  studentId: number,
  category: QueryCategory,
  subject: string,
  message: string,
): Promise<QueryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = loadQueriesFromStorage();
      const newQuery: QueryItem = {
        id: Date.now(),
        studentId,
        category,
        subject,
        message,
        status: "pending",
        replies: [],
        createdAt: new Date().toISOString(),
      };
      saveQueriesToStorage([newQuery, ...existing]);
      saveNotification({
        id: Date.now() + 1,
        studentId,
        title: "Query submitted",
        message: `Your ${category.toLowerCase()} query has been submitted and is awaiting review.`,
        type: "query",
        read: false,
        createdAt: new Date().toISOString(),
      });
      resolve(loadQueriesFromStorage());
    }, 450);
  });
};

export const replyToQuery = (
  queryId: number,
  sender: "student" | "faculty" | "admin",
  message: string,
): Promise<QueryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = loadQueriesFromStorage();
      const updated = existing.map((query) => {
        if (query.id === queryId) {
          const replies = [
            ...(query.replies ?? []),
            {
              id: `${queryId}-${Date.now()}`,
              sender,
              message,
              createdAt: new Date().toISOString(),
            },
          ];
          const status: QueryStatus =
            sender === "student" ? "pending" : "in progress";
          return { ...query, replies, status };
        }
        return query;
      });
      saveQueriesToStorage(updated);
      const target = existing.find((query) => query.id === queryId);
      if (target?.studentId) {
        saveNotification({
          id: Date.now() + 2,
          studentId: target.studentId,
          title: "Query updated",
          message: `A reply has been added to your query: ${target.subject}.`,
          type: "query",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
      resolve(updated);
    }, 450);
  });
};

const QUERY_STORAGE_KEY = "educrm_queries";
const RESULT_STORAGE_KEY = "educrm_results";
const ATTENDANCE_STORAGE_KEY = "educrm_attendance";
const NOTIFICATION_STORAGE_KEY = "educrm_notifications";
const ENROLLMENT_STORAGE_KEY = "educrm_enrollments";

const defaultQueries: QueryItem[] = [
  {
    id: 1001,
    studentId: 3,
    category: "Admission",
    subject: "Admission deadline",
    message:
      "When will the next admission cycle begin for the next academic year?",
    status: "pending",
    replies: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 1002,
    studentId: 3,
    category: "Academics",
    subject: "Grade clarification",
    message:
      "My internal score seems incorrect for Data Structures. Please review.",
    status: "in progress",
    replies: [
      {
        id: "1002-1",
        sender: "faculty",
        message: "We are checking your record and will revert soon.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];

const defaultResults: StudentResult[] = [
  {
    id: 1,
    studentId: 3,
    semester: "Semester 1",
    subjects: [
      {
        subjectId: 1,
        subjectName: "Introduction to Computer Science",
        internal: 40,
        external: 45,
        total: 85,
        grade: "A",
      },
      {
        subjectId: 3,
        subjectName: "Data Structures & Algorithms",
        internal: 38,
        external: 42,
        total: 80,
        grade: "A-",
      },
      {
        subjectId: 5,
        subjectName: "Introduction to Psychology",
        internal: 35,
        external: 40,
        total: 75,
        grade: "B+",
      },
    ],
  },
  {
    id: 2,
    studentId: 3,
    semester: "Semester 2",
    subjects: [
      {
        subjectId: 2,
        subjectName: "Principles of Marketing",
        internal: 42,
        external: 41,
        total: 83,
        grade: "A-",
      },
      {
        subjectId: 4,
        subjectName: "Financial Accounting",
        internal: 37,
        external: 39,
        total: 76,
        grade: "B+",
      },
      {
        subjectId: 1,
        subjectName: "Introduction to Computer Science",
        internal: 43,
        external: 44,
        total: 87,
        grade: "A",
      },
    ],
  },
];

const defaultAttendance: AttendanceRecord[] = [
  { studentId: 3, subjectId: 1, attended: 18, total: 22 },
  { studentId: 3, subjectId: 2, attended: 14, total: 20 },
  { studentId: 3, subjectId: 3, attended: 20, total: 22 },
  { studentId: 3, subjectId: 5, attended: 16, total: 18 },
];

const defaultNotifications: Notification[] = [
  {
    id: 2001,
    studentId: 3,
    title: "Performance published",
    message: "Your Semester 2 marks have been published.",
    type: "marks",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 2002,
    studentId: 3,
    title: "Attendance warning",
    message: "Your attendance for Principles of Marketing is below 75%.",
    type: "attendance",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

const loadQueriesFromStorage = (): QueryItem[] => {
  if (typeof window === "undefined") return defaultQueries;
  try {
    const stored = window.localStorage.getItem(QUERY_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as QueryItem[]) : defaultQueries;
  } catch {
    return defaultQueries;
  }
};

const saveQueriesToStorage = (queries: QueryItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(queries));
};

const loadResultsFromStorage = (): StudentResult[] => {
  if (typeof window === "undefined") return defaultResults;
  try {
    const stored = window.localStorage.getItem(RESULT_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StudentResult[]) : defaultResults;
  } catch {
    return defaultResults;
  }
};

const loadAttendanceFromStorage = (): AttendanceRecord[] => {
  if (typeof window === "undefined") return defaultAttendance;
  try {
    const stored = window.localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as AttendanceRecord[])
      : defaultAttendance;
  } catch {
    return defaultAttendance;
  }
};

const loadNotificationsFromStorage = (): Notification[] => {
  if (typeof window === "undefined") return defaultNotifications;
  try {
    const stored = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as Notification[])
      : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
};

const saveNotificationsToStorage = (notifications: Notification[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    NOTIFICATION_STORAGE_KEY,
    JSON.stringify(notifications),
  );
};

const saveNotification = (notification: Notification) => {
  if (typeof window === "undefined") return;
  const existing = loadNotificationsFromStorage();
  saveNotificationsToStorage([notification, ...existing]);
};

export const fetchStudentResults = (
  studentId: number,
): Promise<StudentResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        loadResultsFromStorage().filter(
          (result) => result.studentId === studentId,
        ),
      );
    }, 400);
  });
};

export const fetchStudentAttendance = (
  studentId: number,
): Promise<AttendanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        loadAttendanceFromStorage().filter(
          (record) => record.studentId === studentId,
        ),
      );
    }, 400);
  });
};

export const fetchNotifications = (
  studentId: number,
): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        loadNotificationsFromStorage().filter(
          (note) => note.studentId === studentId,
        ),
      );
    }, 300);
  });
};

export const markNotificationRead = (
  notificationId: number,
): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = loadNotificationsFromStorage().map((note) =>
        note.id === notificationId ? { ...note, read: true } : note,
      );
      saveNotificationsToStorage(notifications);
      resolve(notifications);
    }, 250);
  });
};

export const fetchEnrollments = (): Promise<Enrollment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadEnrollmentsFromStorage());
    }, 250);
  });
};

const loadEnrollmentsFromStorage = (): Enrollment[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Enrollment[]) : [];
  } catch {
    return [];
  }
};

const saveEnrollmentsToStorage = (enrollments: Enrollment[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ENROLLMENT_STORAGE_KEY,
    JSON.stringify(enrollments),
  );
};

export const registerStudentToCourse = (
  studentId: number,
  courseId: number,
): Promise<Enrollment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = loadEnrollmentsFromStorage();
      const already = existing.find(
        (e) => e.studentId === studentId && e.courseId === courseId,
      );
      if (!already) {
        existing.push({
          studentId,
          courseId,
          scores: [],
          status: "pending",
          requestedAt: new Date().toISOString(),
        });
        saveEnrollmentsToStorage(existing);
        saveNotification({
          id: Date.now() + 3,
          studentId,
          title: "Enrollment request sent",
          message:
            "Your subject enrollment request has been submitted and is pending approval.",
          type: "enrollment",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
      resolve(existing);
    }, 250);
  });
};

export const updateEnrollmentScores = (
  studentId: number,
  courseId: number,
  scores: number[],
): Promise<Enrollment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = loadEnrollmentsFromStorage();
      const idx = existing.findIndex(
        (e) => e.studentId === studentId && e.courseId === courseId,
      );
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], scores };
        saveEnrollmentsToStorage(existing);
      }
      resolve(existing);
    }, 250);
  });
};

export const updateEnrollmentStatus = (
  studentId: number,
  courseId: number,
  status: "pending" | "approved" | "rejected",
): Promise<Enrollment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = loadEnrollmentsFromStorage();
      const idx = existing.findIndex(
        (e) => e.studentId === studentId && e.courseId === courseId,
      );
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], status };
        saveEnrollmentsToStorage(existing);
      }
      resolve(existing);
    }, 250);
  });
};

export const fetchNavigation = (): Promise<NavigationItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Dashboard",
          icon: "LayoutDashboard",
          path: "/",
          active: true,
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
      ]);
    }, 400);
  });
};
