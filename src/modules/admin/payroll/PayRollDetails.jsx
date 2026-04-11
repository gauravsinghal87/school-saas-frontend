import { useParams, useNavigate } from "react-router-dom";
import { useStaffSalaryDetails } from "../../../hooks/useQueryMutations";
import {
  FaUserCircle,
  FaBriefcase,
  FaIdCard,
  FaRupeeSign,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoice,
  FaSpinner,
  FaRegClock,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaArrowLeft
} from "react-icons/fa";
import { MdAttachMoney, MdOutlineDateRange } from "react-icons/md";
import { GiPayMoney, GiCalendarHalfYear } from "react-icons/gi";
import { BiUser, BiDetail, BiMoney } from "react-icons/bi";

export default function StaffSalaryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useStaffSalaryDetails(id);

  const staff = data?.data?.staff;
  const salaries = data?.data?.salaries || [];

  const getMonthName = (month) =>
    new Date(0, month - 1).toLocaleString("default", { month: "long" });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary font-medium">Loading salary details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page py-8 md:px-4 sm:px-6 lg:px-8">
      <div className="w-[93vw] md:w-auto mx-auto space-y-8">
        
        {/* Header with Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group cursor-pointer flex items-center gap-2 px-4 py-2 bg-surface-card border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all duration-200 "
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-3xl font-bold text-text-heading" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Salary Details
              </h1>
              <p className="text-text-secondary mt-1" style={{ fontFamily: "'Merriweather', serif" }}>
                Complete salary breakdown and history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary bg-surface-card backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
            <FaRegClock className="w-4 h-4 text-primary" />
            <span>Last updated: {salaries[0] ? formatDate(salaries[0].updatedAt) : 'N/A'}</span>
          </div>
        </div>

        {/* Staff Info Card - Modern Glassmorphism */}
        <div className="bg-surface-card backdrop-blur-lg rounded-2xl  border border-border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-page from-primary to-secondary flex items-center justify-center shadow-lg">
                <FaUserCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {staff?.user?.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <FaBriefcase className="w-3 h-3" />
                    {staff?.designation}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    <FaUsers className="w-3 h-3" />
                    {staff?.department}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    <FaIdCard className="w-3 h-3" />
                    {staff?.employee_id}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-text-secondary text-sm flex items-center gap-1">
                    <FaEnvelope className="w-3 h-3" />
                    {staff?.user?.email}
                  </p>
                  <p className="text-text-secondary text-sm flex items-center gap-1">
                    <FaPhone className="w-3 h-3" />
                    {staff?.user?.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl px-6 py-3 shadow-md">
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <BiMoney className="w-3 h-3" />
                  Base Salary
                </p>
                <p className="text-white text-2xl font-bold">{formatCurrency(staff?.salary)}</p>
              </div>
              <p className="text-xs text-text-secondary flex items-center gap-1">
                <FaGraduationCap className="w-3 h-3" />
                Role: {staff?.role?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface-page from-primary to-primary/80 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <FaFileInvoice className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{salaries.length}</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Total Records</p>
          </div>

          <div className="bg-surface-page from-success to-success/80 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <FaRupeeSign className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{formatCurrency(salaries[0]?.generatedSalary || 0)}</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Latest Salary</p>
          </div>

          <div className="bg-surface-page from-warning to-warning/80 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <MdAttachMoney className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{formatCurrency(salaries[0]?.perDaySalary || 0)}</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Per Day Salary</p>
          </div>

          <div className="bg-surface-page from-info to-info/80 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <FaCalendarAlt className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{salaries[0]?.presentDays || 0}</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Present Days</p>
          </div>
        </div>

        {/* Salary Table with Modern Design */}
        <div className="bg-surface-card rounded-2xl  overflow-hidden border border-border">
          <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-page to-surface-card">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <FaChartLine className="w-5 h-5 text-primary" />
              Salary History
            </h3>
            <p className="text-sm text-text-secondary mt-1" style={{ fontFamily: "'Merriweather', serif" }}>
              Monthly salary breakdown and attendance records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-page border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <GiCalendarHalfYear className="w-3 h-3" />
                      Month
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <GiPayMoney className="w-3 h-3" />
                      Generated Salary
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MdAttachMoney className="w-3 h-3" />
                      Per Day
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <BiUser className="w-3 h-3" />
                      Generated By
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MdOutlineDateRange className="w-3 h-3" />
                      Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salaries.map((item, index) => (
                  <tr key={item._id} className="hover:bg-primary/5 transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{getMonthName(item.month)}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{item.year}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-success bg-success/10 px-2 py-1 rounded-lg">
                        {formatCurrency(item.generatedSalary)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded-lg">
                          <FaCheckCircle className="w-3 h-3" />
                          {item.presentDays}
                        </span>
                        <span className="inline-flex items-center gap-1 text-error bg-error/10 px-2 py-1 rounded-lg">
                          <FaTimesCircle className="w-3 h-3" />
                          {item.absentDays}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-medium">{formatCurrency(item.perDaySalary)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-text-primary flex items-center gap-1">
                          <BiUser className="w-3 h-3" />
                          {item.generatedBy?.name}
                        </div>
                        <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                          <FaEnvelope className="w-2 h-2" />
                          {item.generatedBy?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-xs">
                      {formatDate(item.generatedAt)}
                    </td>
                  </tr>
                ))}

                {salaries.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FaFileInvoice className="w-12 h-12 text-text-secondary/30" />
                        <p className="text-text-secondary font-medium">No salary records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {salaries.length > 0 && (
          <div className="bg-surface-card backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-text-secondary flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3 text-primary" />
                  Total Paid Holidays:
                </span>
                <span className="font-semibold text-text-primary">{salaries[0]?.paidHolidayCount || 0}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3 text-secondary" />
                  Sundays:
                </span>
                <span className="font-semibold text-text-primary">{salaries[0]?.sundayCount || 0}</span>
              </div>
              <div className="text-xs text-text-secondary flex items-center gap-1">
                <FaRegClock className="w-3 h-3" />
                Generated on: {salaries[0] ? formatDate(salaries[0].generatedAt) : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}