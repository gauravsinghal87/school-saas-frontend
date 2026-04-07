import {
    LayoutDashboard,
    School,
    CreditCard,
    BarChart3,
    Settings,
    Bell,
    Users,
    UserCog,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    FileText,
    Receipt,
    Megaphone,
    ShieldCheck,
    Database,
    Activity,
    UserCircle,
    Clock,
    Wallet,
    Trophy,
    MessageSquare,
    BookMarked,
    Layers,
    FileBadge,
    CalendarDays,
    UserCheck,
    Briefcase,
    PieChart,
    FileBarChart,
    Banknote,
    HeartPulse,
    FolderOpen,
    Send,
    Star,
    Calendar,
} from "lucide-react";

import { ROLES } from "./roles";


export const MENU_CONFIG = {

    // ── SUPER ADMIN ─────────────────────────────────────────────────────────────

    [ROLES.SUPER_ADMIN]: [
        // main
        { id: "sa-dashboard", name: "Dashboard", path: "dashboard", icon: LayoutDashboard, section: "main" },
        { id: "sa-schools", name: "Schools", path: "schools", icon: School, section: "main" },
        { id: "sa-subscriptions", name: "Subscriptions", path: "subscriptions", icon: CreditCard, section: "main" },
        { id: "sa-analytics", name: "Analytics", path: "analytics", icon: PieChart, section: "main" },

        // management
        { id: "sa-roles", name: "Roles & Perms", path: "roles", icon: ShieldCheck, section: "management" },

        // system
        { id: "sa-reports", name: "Reports", path: "reports", icon: FileBarChart, section: "system" },
        { id: "sa-announcements", name: "Announcements", path: "announcements", icon: Megaphone, section: "system" },
        { id: "sa-settings", name: "Settings", path: "settings", icon: Settings, section: "system" },

    ],

    // ── SCHOOL ADMIN ────────────────────────────────────────────────────────────

    [ROLES.SCHOOL_ADMIN]: [
        // main

        { id: "admin-dashboard", name: "Dashboard", path: "dashboard", icon: LayoutDashboard, section: "main" },
        { id: "academic-sessions", name: "Sessions", path: "academic-sessions", icon: Clock, section: "main" },
        { id: "admin-classes", name: "Classes", path: "classes", icon: Layers, section: "main" },
        { id: "admin-sections", name: "Sections", path: "sections", icon: Layers, section: "main" },
        { id: "admin-subjects", name: "Subjects", path: "subjects", icon: BookOpen, section: "main" },

        { id: "admin-timetable", name: "Timetable", path: "timetable", icon: CalendarDays, section: "main" },
        { id: "admin-students", name: "Students", path: "students", icon: GraduationCap, section: "academic" },
        { id: "admin-staff", name: "Staff", path: "staff", icon: Briefcase, section: "academic" },
        { id: "admin-exams", name: "Exams", path: "exams", icon: ClipboardList, section: "academic" },

        // finance
        { id: "admin-fees", name: "Fee Structure", path: "fees", icon: Banknote, section: "finance" },
        { id: "admin-payroll", name: "Payroll", path: "payroll", icon: Wallet, section: "finance" },
        { id: "admin-notices", name: "Notice Board", path: "notices", icon: Megaphone, section: "communication" },


        // settings
        { id: "admin-holidays", name: "Holidays", path: "holidays", icon: Calendar, section: "settings" },
        { id: "admin-reports", name: "Reports", path: "reports", icon: FileBarChart, section: "settings" },
        { id: "admin-settings", name: "School Settings", path: "settings", icon: Settings, section: "settings" },
        // { id: "teachers", name: "Teachers", path: "teachers", icon: Briefcase, section: "main" },

        // { id: "admin-parents", name: "Parents", path: "parents", icon: Users, section: "main" },
        // reprot exam report , attendance report, fee report

        // academic


        // { id: "admin-results", name: "Results", path: "results", icon: BarChart3, section: "academic" },
        // { id: "admin-attendance", name: "Attendance", path: "attendance", icon: CalendarCheck, section: "academic" },
        // { id: "admin-assignments", name: "Assignments", path: "assignments", icon: BookMarked, section: "academic" },
        // communication
        // { id: "admin-messages", name: "Messages", path: "messages", icon: MessageSquare, section: "communication", badge: 3 },


    ],

    // ── STAFF / TEACHER ─────────────────────────────────────────────────────────

    [ROLES.STAFF]: [
        // main
        { id: "staff-dashboard", name: "Dashboard", path: "dashboard", icon: LayoutDashboard, section: "main" },
        { id: "staff-students", name: "My Students", path: "students", icon: GraduationCap, section: "main", badge: 4 },
        { id: "staff-schedule", name: "Schedule", path: "schedule", icon: CalendarDays, section: "main" },
        { id: "staff-assignments", name: "Assignments", path: "assignments", icon: BookMarked, section: "main", badge: 1 },

        // // academic
        { id: "student-attendance", name: "Student Attendance", path: "attendance", icon: CalendarCheck, section: "academic" },
        // { id: "staff-marks", name: "Marks & Exams", path: "marks", icon: BarChart3, section: "academic" },
        // { id: "staff-materials", name: "Study Materials", path: "study-materials", icon: FolderOpen, section: "academic" },
        { id: "staff-timetable", name: "Timetable", path: "timetable", icon: ClipboardList, section: "academic" },
        { id: "staff-holidays", name: "Holidays", path: "holidays", icon: Calendar, section: "academic" },


        // // personal
        // { id: "staff-leaves", name: "Leave Requests", path: "leaves", icon: Send, section: "personal" },
        // { id: "staff-payroll", name: "Payroll", path: "payroll", icon: Wallet, section: "personal" },
        // { id: "staff-clockin", name: "Attendance Log", path: "clock-in", icon: Clock, section: "personal" },
        // { id: "staff-profile", name: "My Profile", path: "profile", icon: UserCircle, section: "personal" },
    ],

    // ── STUDENT ─────────────────────────────────────────────────────────────────

    [ROLES.STUDENT]: [
        // main
        { id: "stu-dashboard", name: "Dashboard", path: "dashboard", icon: LayoutDashboard, section: "main" },
        { id: "stu-schedule", name: "My Schedule", path: "schedule", icon: CalendarDays, section: "main" },
        { id: "stu-attendance", name: "Attendance", path: "attendance", icon: CalendarCheck, section: "main" },

        // academic
        { id: "stu-subjects", name: "Subjects", path: "subjects", icon: BookOpen, section: "academic" },
        { id: "stu-assignments", name: "Assignments", path: "assignments", icon: BookMarked, section: "academic", badge: 2 },
        { id: "stu-materials", name: "Study Materials", path: "study-materials", icon: FolderOpen, section: "academic" },
        { id: "stu-results", name: "Results", path: "results", icon: BarChart3, section: "academic" },
        { id: "stu-marksheet", name: "Marksheets", path: "marksheets", icon: FileBadge, section: "academic" },

        // personal
        { id: "stu-fees", name: "Fees", path: "fees", icon: Receipt, section: "personal" },
        { id: "stu-achievements", name: "Achievements", path: "achievements", icon: Trophy, section: "personal" },
        { id: "stu-health", name: "Health Records", path: "health", icon: HeartPulse, section: "personal" },
        { id: "stu-notices", name: "Notice Board", path: "notices", icon: Bell, section: "personal", badge: 1 },
        { id: "stu-profile", name: "My Profile", path: "profile", icon: UserCircle, section: "personal" },
    ],

    // ── PARENT ──────────────────────────────────────────────────────────────────

    [ROLES.PARENT]: [
        // main
        { id: "par-dashboard", name: "Dashboard", path: "dashboard", icon: LayoutDashboard, section: "main" },
        { id: "par-children", name: "My Children", path: "children", icon: Users, section: "main" },
        { id: "par-attendance", name: "Attendance", path: "attendance", icon: UserCheck, section: "main" },

        // academic
        { id: "par-results", name: "Results", path: "results", icon: BarChart3, section: "academic" },
        { id: "par-assignments", name: "Assignments", path: "assignments", icon: BookMarked, section: "academic" },
        { id: "par-timetable", name: "Timetable", path: "timetable", icon: CalendarDays, section: "academic" },
        { id: "par-marksheets", name: "Marksheets", path: "marksheets", icon: FileBadge, section: "academic" },

        // personal
        { id: "par-fees", name: "Fees & Payments", path: "fees", icon: Receipt, section: "personal" },
        { id: "par-health", name: "Health Records", path: "health", icon: HeartPulse, section: "personal" },
        { id: "par-achievements", name: "Achievements", path: "achievements", icon: Star, section: "personal" },
        { id: "par-notices", name: "Notice Board", path: "notices", icon: Megaphone, section: "personal", badge: 2 },
        { id: "par-messages", name: "Messages", path: "messages", icon: MessageSquare, section: "personal", badge: 1 },
        { id: "par-profile", name: "My Profile", path: "profile", icon: UserCircle, section: "personal" },
    ],
};
