import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreVertical,
  ChevronRight,
  CreditCard,
  UserCheck,
  UserX,
  Award,
  BookOpen,
  Bell,
  Search,
  Settings,
  Clock,
  BookMarked,
  Target,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  LogOut,
  HelpCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Chart refs
  const revenueChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const subjectChartRef = useRef(null);
  const feeChartRef = useRef(null);
  const studentTrendChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const attendanceChartInstance = useRef(null);
  const subjectChartInstance = useRef(null);
  const feeChartInstance = useRef(null);
  const studentTrendInstance = useRef(null);

  // Static Dashboard Data
  const dashboardStats = {
    totalStudents: 1850,
    newStudentsThisMonth: 124,
    totalTeachers: 124,
    totalStaff: 198,
    monthlyRevenue: 4250000,
    monthlyExpenses: 2150000,
    attendanceRate: 94.8,
    averageMarks: 79.2,
    pendingFees: 680000,
    activeClasses: 42,
    passPercentage: 96.5,
    libraryBooks: 12500,
  };

  // Trophy Icon Component
  const Trophy = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  // Static Chart Data
  useEffect(() => {
    // Revenue Trend Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue 2024',
              data: [2850000, 3120000, 3480000, 3650000, 3920000, 4080000, 4250000, 4520000, 4680000, 4850000, 5120000, 5380000],
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#2563EB',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Revenue 2023',
              data: [2450000, 2680000, 2950000, 3120000, 3380000, 3550000, 3780000, 3950000, 4120000, 4350000, 4580000, 4750000],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: {
              backgroundColor: '#1F2937',
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || '';
                  let value = context.parsed.y;
                  return `${label}: ₹${(value / 100000).toFixed(1)}L`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#E5E7EB' },
              ticks: { callback: (value) => `₹${(value / 100000).toFixed(0)}L` },
            },
          },
        },
      });
    }

    // Attendance Overview Chart
    if (attendanceChartRef.current) {
      if (attendanceChartInstance.current) {
        attendanceChartInstance.current.destroy();
      }
      attendanceChartInstance.current = new Chart(attendanceChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [
            {
              label: 'Present',
              data: [92, 95, 91, 94, 96],
              backgroundColor: '#2563EB',
              borderRadius: 8,
              barPercentage: 0.6,
            },
            {
              label: 'Absent',
              data: [8, 5, 9, 6, 4],
              backgroundColor: '#DC2626',
              borderRadius: 8,
              barPercentage: 0.6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: { backgroundColor: '#1F2937' },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: '#E5E7EB' },
              ticks: { callback: (value) => `${value}%` },
            },
          },
        },
      });
    }

    // Subject Performance Chart
    if (subjectChartRef.current) {
      if (subjectChartInstance.current) {
        subjectChartInstance.current.destroy();
      }
      subjectChartInstance.current = new Chart(subjectChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Sci', 'Hindi', 'Sanskrit'],
          datasets: [
            {
              label: 'Average Marks (%)',
              data: [84, 79, 88, 76, 91, 82, 78],
              backgroundColor: 'rgba(37, 99, 235, 0.8)',
              borderColor: '#2563EB',
              borderWidth: 1,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1F2937',
              callbacks: { label: (context) => `Average: ${context.parsed.y}%` },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: '#E5E7EB' },
              ticks: { callback: (value) => `${value}%` },
            },
          },
        },
      });
    }

    // Fee Collection Doughnut Chart
    if (feeChartRef.current) {
      if (feeChartInstance.current) {
        feeChartInstance.current.destroy();
      }
      feeChartInstance.current = new Chart(feeChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Paid (₹2.8M)', 'Pending (₹0.68M)', 'Overdue (₹0.24M)'],
          datasets: [
            {
              data: [68, 22, 10],
              backgroundColor: ['#16A34A', '#F59E0B', '#DC2626'],
              borderWidth: 0,
              cutout: '65%',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed}%` } },
          },
        },
      });
    }

    // Student Enrollment Trend
    if (studentTrendChartRef.current) {
      if (studentTrendInstance.current) {
        studentTrendInstance.current.destroy();
      }
      studentTrendInstance.current = new Chart(studentTrendChartRef.current, {
        type: 'line',
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: 'Total Students',
              data: [1250, 1420, 1580, 1720, 1850],
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#8B5CF6',
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: { backgroundColor: '#1F2937' },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#E5E7EB' } },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (attendanceChartInstance.current) attendanceChartInstance.current.destroy();
      if (subjectChartInstance.current) subjectChartInstance.current.destroy();
      if (feeChartInstance.current) feeChartInstance.current.destroy();
      if (studentTrendInstance.current) studentTrendInstance.current.destroy();
    };
  }, []);

  // Recent Activities Data
  const recentActivities = [
    { id: 1, type: 'student', action: 'New student enrolled', name: 'Aarav Sharma', class: 'Class 10-A', time: '2 minutes ago', icon: GraduationCap, color: 'text-primary', bgColor: 'bg-primary/10' },
    { id: 2, type: 'fee', action: 'Fee payment received', name: 'Ishita Verma', amount: '₹35,000', time: '1 hour ago', icon: CreditCard, color: 'text-success', bgColor: 'bg-success/10' },
    { id: 3, type: 'exam', action: 'Exam results published', name: 'Mid-Term Exams', class: 'All Classes', time: '3 hours ago', icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 4, type: 'attendance', action: 'Low attendance alert', name: 'Class 9-B', attendance: '72%', time: '5 hours ago', icon: UserX, color: 'text-error', bgColor: 'bg-error/10' },
    { id: 5, type: 'teacher', action: 'New teacher joined', name: 'Dr. Priya Singh', department: 'Mathematics', time: '1 day ago', icon: Briefcase, color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { id: 6, type: 'achievement', action: 'Sports achievement', name: 'Interschool Cricket Champions', time: '2 days ago', icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10' },
  ];

  // Upcoming Events
  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: 'Dec 15, 2024', time: '10:00 AM', location: 'Auditorium', type: 'meeting', priority: 'high' },
    { id: 2, title: 'Annual Sports Day', date: 'Dec 20, 2024', time: '9:00 AM', location: 'Sports Ground', type: 'event', priority: 'high' },
    { id: 3, title: 'Winter Break', date: 'Dec 25, 2024', time: 'All Day', location: 'School Closed', type: 'holiday', priority: 'medium' },
    { id: 4, title: 'Board Exam Registration', date: 'Jan 5, 2025', time: '11:59 PM', location: 'Deadline', type: 'deadline', priority: 'urgent' },
    { id: 5, title: 'Science Exhibition', date: 'Jan 10, 2025', time: '9:30 AM', location: 'Science Block', type: 'event', priority: 'medium' },
  ];

  // Top Performing Students
  const topStudents = [
    { id: 1, name: 'Aarav Sharma', class: '12-A', percentage: 98.5, rank: 1, avatar: 'AS' },
    { id: 2, name: 'Ishita Verma', class: '12-B', percentage: 97.8, rank: 2, avatar: 'IV' },
    { id: 3, name: 'Rohan Mehta', class: '12-A', percentage: 96.2, rank: 3, avatar: 'RM' },
    { id: 4, name: 'Priya Patel', class: '12-C', percentage: 95.5, rank: 4, avatar: 'PP' },
    { id: 5, name: 'Kunal Singh', class: '12-B', percentage: 94.8, rank: 5, avatar: 'KS' },
  ];

  // Quick Stats Cards
  const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
          {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-text-secondary">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Modern Header */}


      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={dashboardStats.totalStudents}
            subtext={`+${dashboardStats.newStudentsThisMonth} new this month`}
            icon={GraduationCap}
            trend="up"
            trendValue="+8.2%"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Teachers"
            value={dashboardStats.totalTeachers}
            subtext="Across 42 classes"
            icon={Briefcase}
            trend="up"
            trendValue="+4.5%"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${(dashboardStats.monthlyRevenue / 100000).toFixed(1)}L`}
            subtext={`Expenses: ₹${(dashboardStats.monthlyExpenses / 100000).toFixed(1)}L`}
            icon={DollarSign}
            trend="up"
            trendValue="+12.3%"
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Attendance Rate"
            value={`${dashboardStats.attendanceRate}%`}
            subtext="Above national average"
            icon={UserCheck}
            trend="up"
            trendValue="+1.8%"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{dashboardStats.passPercentage}%</span>
            </div>
            <p className="text-indigo-100 text-sm mt-2">Pass Percentage</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <BookOpen className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{dashboardStats.libraryBooks}</span>
            </div>
            <p className="text-emerald-100 text-sm mt-2">Library Books</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{dashboardStats.activeClasses}</span>
            </div>
            <p className="text-amber-100 text-sm mt-2">Active Classes</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{dashboardStats.averageMarks}%</span>
            </div>
            <p className="text-rose-100 text-sm mt-2">Average Marks</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Revenue Trend
                </h3>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                  Monthly revenue comparison (2023 vs 2024)
                </p>
              </div>
              <button className="p-1 hover:bg-surface-page rounded-lg">
                <MoreVertical className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <div className="h-80">
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>

          {/* Student Enrollment Trend */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Student Growth
                </h3>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                  Year-over-year enrollment trend
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-text-primary">+48%</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">Growth</span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={studentTrendChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Subject Performance */}
          <div className="lg:col-span-2 bg-surface-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Subject Performance
                </h3>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                  Average marks by subject
                </p>
              </div>
              <button className="text-primary text-sm font-medium hover:text-primary/80 flex items-center gap-1">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="h-80">
              <canvas ref={subjectChartRef}></canvas>
            </div>
          </div>

          {/* Fee Collection */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Fee Collection
                </h3>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                  Collection status breakdown
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">Pending Amount</p>
                <p className="text-lg font-bold text-error">₹{(dashboardStats.pendingFees / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <div className="h-64">
              <canvas ref={feeChartRef}></canvas>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">Collection Target Progress</span>
                <span className="text-sm font-semibold text-text-primary">71%</span>
              </div>
              <div className="h-2 bg-surface-page rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-success to-emerald-500 rounded-full animate-slideIn" style={{ width: '71%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Overview */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Attendance Overview
                </h3>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                  Weekly attendance breakdown (Current Month)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-text-primary">{dashboardStats.attendanceRate}%</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">+2.1%</span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={attendanceChartRef}></canvas>
            </div>
          </div>

          {/* Top Performing Students */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Top Performers
                  </h3>
                  <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                    Highest academic achievers
                  </p>
                </div>
                <Award className="w-8 h-8 text-warning" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {topStudents.map((student) => (
                <div key={student.id} className="p-4 hover:bg-surface-page transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${student.rank === 1 ? 'from-yellow-400 to-yellow-500' :
                        student.rank === 2 ? 'from-gray-300 to-gray-400' :
                          student.rank === 3 ? 'from-orange-400 to-orange-500' :
                            'from-primary to-primary/80'
                      } flex items-center justify-center text-white font-bold shadow-md`}>
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{student.name}</p>
                      <p className="text-xs text-text-secondary">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">{student.percentage}%</p>
                      <p className="text-xs text-text-secondary">Rank #{student.rank}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface-page rounded-b-2xl">
              <button className="text-primary text-sm font-medium w-full text-center hover:text-primary/80">
                View Complete Merit List →
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Recent Activities
                  </h3>
                  <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                    Latest updates from your school
                  </p>
                </div>
                <Activity className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-surface-page transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                      <p className="text-sm text-text-secondary mt-0.5">{activity.name}</p>
                      {activity.class && <p className="text-xs text-text-secondary mt-0.5">{activity.class}</p>}
                      {activity.amount && <p className="text-xs font-medium text-success mt-0.5">{activity.amount}</p>}
                      {activity.attendance && <p className="text-xs font-medium text-error mt-0.5">Attendance: {activity.attendance}</p>}
                    </div>
                    <div className="text-xs text-text-secondary">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Upcoming Events
                  </h3>
                  <p className="text-sm text-text-secondary" style={{ fontFamily: "'Merriweather', serif" }}>
                    Important dates and deadlines
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-surface-page transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${event.priority === 'urgent' ? 'bg-error/10 animate-pulse' :
                        event.priority === 'high' ? 'bg-warning/10' :
                          'bg-info/10'
                      }`}>
                      <Calendar className={`w-5 h-5 ${event.priority === 'urgent' ? 'text-error' :
                          event.priority === 'high' ? 'text-warning' :
                            'text-info'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-secondary">{event.date}</span>
                        <span className="text-xs text-text-secondary">•</span>
                        <span className="text-xs text-text-secondary">{event.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{event.location}</p>
                    </div>
                    {event.priority === 'urgent' && (
                      <span className="text-xs font-medium text-error bg-error/10 px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-secondary">Next: Parent-Teacher Meeting in 5 days</span>
                </div>
                <button className="text-primary text-sm font-medium hover:text-primary/80">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 71%;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;