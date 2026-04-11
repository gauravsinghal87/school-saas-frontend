export const API_BASE_URL = "http://localhost:8080/api";


export const apiPaths = {
    auth: {
        login: "/api/user/login",
        me: "/api/user/me",
    },
    students: {
        list: "/api/student",
        create: "/students",
        UPLOAD_STUDENT_DOCS: "/api/staff",
        GET_STUDENT_BY_ID: "/api/student/",
        ENROLL_STUDENT: "/api/student/enroll",
        SUBJECTS: "/api/student/subjects",
        ASSIGNMENTS: "/api/student/assignments",
        STUDENT_TIMETABLE: '/api/timetable/timetable',
        SUBMIT_ASSIGNMENT: "/api/student/submit",
        EXAMS: "/api/student/exam-timetable",
        PROFILE: "/api/student/profile",
        STUDENT_ATTENDANCE: "/api/attendance/student",

    },
    parent: {
        MY_CHILDREN: "/api/parent/my-children",
        MY_PROFILE: "/api/parent",
        PAYMENTS: "/api/parent/payments",

    },
    teacher: {
        // list: "/teachers",
        create: "/teachers",
        teachersList: "/teachers",
        createTeacher: "/create/teacher",
        ADMIN_TEACHERS: "/api/admin/teachers",

        MARK_ATTENDANCE: "/api/attendance/student/mark",
        GET_ATTENDANCE: "/api/attendance/student?studentId={studentId}",
        GET_CLASS_ATTENDANCE: "/api/attendance/student/class",
        GET_STUDENTS: "/api/student",
        CREATE_HOLIDAY: "/api/holiday",
        UPDATE_HOLIDAY: "/api/holiday/{holidayId}",
        DELETE_HOLIDAY: "/api/holiday/{holidayId}",
        GET_HOLIDAYS: "/api/holiday?page={page}&limit={limit}&search={search}",


        CREATE_ASSIGNMENT: "/api/teacher/assignment&notes/upload-assignment",
        UPDATE_ASSIGNMENT: "/api/teacher/assignment&notes/update-assignment/{assignmentId}",
        GET_ASSIGNMENTS: "/api/teacher/assignment&notes/get-assignment",
        DELETE_ASSIGNMENT: "/api/teacher/assignment&notes/delete-assignment/{assignmentId}",

        GET_TIMETABLE: "/api/timetable/timetable/teacher",
        GET_CLASS_SEC_SUB: '/api/staff/class/get',
        TEACHER_CHECK_IN: '/api/attendance/teacher/checkin',
        TEACHER_CHECK_OUT: '/api/attendance/teacher/checkout',
        TEACHER_PROFILE: '/api/staff/teacher',
        TEACHER_ASSIGNMENT_SUBMISSIONS: '/api/teacher/assignment&notes/teacher/submissions',
        TEACHER_ASSIGNMENT_FEEDBACK: '/api/teacher/assignment&notes/feedback/{submissionId}',
        TEACHER_IN_OUT_TIMES: '/api/attendance/teacher?teacherId={teacherId}',

        // Exam Management
        TEACHER_EXAM_LIST: '/api/teacher/exams',
        TEACHER_EXAM_CLASSES: '/api/teacher/exams/classes',
        TEACHER_EXAM_SUBJECTS: '/api/teacher/exams/subjects',
        TEACHER_EXAM_STUDENTS: '/api/teacher/exams/students',
        TEACHER_UPDATE_MARKS: '/api/teacher/exams/marks',
        TEACHER_GET_MARKS: '/api/teacher/exams/marks',
        TEACHER_MARKS_TEMPLATE: '/api/teacher/exams/marks/template',
        TEACHER_BULK_UPLOAD_MARKS: '/api/teacher/exams/marks/bulk-upload',

    },

    superAdmin: {
        ROLES: "/api/super-admin/role",
        REG_SCHOOL: '/api/super-admin/school-reg',
        SCHOOL_LIST: '/api/super-admin/schools',
        UPDATE_SCHOOL: '/api/super-admin/{id}/status',
        CREATE_SUBSCRIPTION: '/api/subscription-plan',
        SUBSCRIPTION_LIST: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION: '/api/subscription-plan',
        DELETE_SUBSCRIPTION: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION_STATUS: '/api/subscription-plan',
        ADMINS: '/api/super-admin/admins',
        CREATE_ROLE: '/api/super-admin/role',
        GET_ROLES: '/api/super-admin/role',
        UPDATE_ROLE: '/api/super-admin/role/{id}',
        DASHBOARD: '/api/super-admin/dashboard',
    },
    admin: {

        ADD_SUBJECT: '/api/admin/subject/reg',
        SUBJECT_LIST: '/api/admin/get/subjects',
        SUBJECT_UPDATE: '/api/admin/subject/{id}',
        SUBJECT_DELETE: '/api/admin/delete/subject/{id}',

        ACADEMIC_YEAR_LIST: 'api/academic-session',
        CREATE_ACADEMIC_YEAR: '/api/academic-session',
        UPDATE_ACADEMIC_YEAR: '/api/academic-session/session',
        CLASSES_LIST: '/api/admin/class/get/all',
        CREATE_CLASS: '/api/admin/class',
        UPDATE_CLASS: '/api/admin/class',
        DELETE_CLASS: '/api/admin/class',
        CREATE_SECTION: '/api/admin/create-section',
        UPDATE_SECTION: '/api/admin/update-section',
        SECTIONS_LIST: '/api/admin/get-sections',

        // Fee Management
        FEE_STRUCTURE: '/api/admin/fees/fees-structure',

        // Timetable Management
        PERIODS: '/api/timetable/periods',
        TIMETABLE: '/api/timetable/timetable',
        DELETE_SECTION: '/api/admin/delete-section',
        CLASS_SUBJECTS: '/api/admin/subjects',
        UPDATE_CLASS_SUBJECTS: 'api/admin/update-subjects',
        REMOVE_CLASS_SUBJECTS: 'api/admin/remove-subjects',
        roles: "",
        staff: "/api/staff",
        CREATE_EXAM: '/api/admin/exam',
        UPDATE_EXAM: '/api/admin/exam',
        CREATE_STAFF: "/api/staff/create",
        UPLOAD_STAFF_DOCS: "/api/staff",
        // Exam Management
        EXAM: '/api/exam',
        EXAM_SUBJECTS: '/api/exam/:id/subjects',
        EXAM_MARKS: '/api/exam/:id/marks',
        EXAM_GENERATE_RESULT: '/api/exam/:id/generate-result',
        EXAM_RESULTS: '/api/exam/:id/results',
        EXAM_STUDENT_RESULTS: '/api/exam/student/:id/results',

        CREATE_HOLIDAY: "/api/holiday",
        UPDATE_HOLIDAY: "/api/holiday/{holidayId}",
        DELETE_HOLIDAY: "/api/holiday/{holidayId}",
        GET_HOLIDAYS: "/api/holiday?page={page}&limit={limit}&search={search}",


        ADD_STUDENT_FEES: '/api/admin/fees/student-payment',
        GET_STUDENT_FEES: '/api/admin/student-list',
        PAYMENT_HISTORY: '/api/admin/student-detail',


        USERS_LIST: '/api/user/list-users',
        SUBSCRIPTIONS_PLAN_LIST: '/api/subscription-plan',
        ACTIVE_SUBSCRIPTIONS: '/api/subscription/school',
        RENEW_SUBSCRIPTION: '/api/subscription/renew',
        VERIFY_SUBSCRIPTION: '/api/subscription/verify-payment',

        USERS_LIST:'/api/user/list-users',
        GENERATE_STAFF_SALARY: '/api/staff/salary/generate',


    }

} 