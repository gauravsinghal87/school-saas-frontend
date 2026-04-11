import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherExamListQuery } from '../../hooks/useQueryMutations';
import DataTable from '../../components/common/ReusableTable';
import { ClipboardCheck, ArrowRight, Calendar, BookOpen, Trophy, Clock, Users, Eye } from 'lucide-react';

const StudentMarksByStaffPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: response, isLoading } = getTeacherExamListQuery();
  const exams = response?.data?.results || [];

  const handleViewMarks = (examId, classId, examStatus) => {
    console.log('Navigating to marks:', { examId, classId, examStatus });
    navigate(`marks?exam_id=${examId}&class_id=${classId}`);
  };

  // Filter exams based on search
  const filteredExams = exams.filter(exam => {
    const searchTerm = search.toLowerCase();
    return (
      exam.exam_name?.toLowerCase().includes(searchTerm) ||
      exam.class?.name?.toLowerCase().includes(searchTerm) ||
      exam.exam_status?.toLowerCase().includes(searchTerm)
    );
  });

  // Get status colors and icons
  const getStatusConfig = (status) => {
    const configs = {
      active: { bg: "bg-success/10", text: "text-success", label: "Active", icon: Trophy },
      upcoming: { bg: "bg-warning/10", text: "text-warning", label: "Upcoming", icon: Clock },
      completed: { bg: "bg-info/10", text: "text-info", label: "Completed", icon: ClipboardCheck }
    };
    return configs[status] || configs.upcoming;
  };

  // Calculate stats
  const stats = {
    total: exams.length,
    active: exams.filter(e => e.exam_status === 'active').length,
    upcoming: exams.filter(e => e.exam_status === 'upcoming').length,
    completed: exams.filter(e => e.exam_status === 'completed').length
  };

  // Define columns for DataTable
  const COLUMNS = [
    {
      key: "index",
      label: "Sr. No",
      sortable: false,
      width: "70px",
      render: (_, row, idx) => (page - 1) * limit + idx + 1,
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-page from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
            <span className="text-lg font-bold text-primary">
              {row.class?.name}
            </span>
          </div>
          <div>
            <p className="font-semibold text-text-heading text-sm">
              Class {row.class?.name}
            </p>
          </div>
        </div>
      )
    },
    {
      key: "exam_name",
      label: "Exam Name",
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-medium text-text-heading text-sm">{val}</p>
          {row.description && (
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{row.description}</p>
          )}
        </div>
      )
    },
    {
      key: "exam_dates",
      label: "Exam Dates",
      sortable: true,
      width: "200px",
      render: (_, row) => (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(row.start_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })} - {new Date(row.end_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      )
    },
    {
      key: "exam_status",
      label: "Status",
      sortable: true,
      width: "120px",
      render: (val) => {
        const status = getStatusConfig(val);
        const StatusIcon = status.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        );
      }
    }
  ];

  // Action Cell with button
  const ActionCell = ({ row }) => {
    const status = getStatusConfig(row.exam_status);

    return (
      <button
        onClick={() => handleViewMarks(row.exam_id, row.class?.id, row.exam_status)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
          bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md
          whitespace-nowrap
        `}
      >
        {row.exam_status === 'completed' ? (
          <>
            <Eye className="w-4 h-4" />
            View Results
          </>
        ) : row.exam_status === 'active' ? (
          <>
            <ClipboardCheck className="w-4 h-4" />
            Enter Marks
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            View Details
          </>
        )}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-text-secondary mt-4 font-medium">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">Exam Portal</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Manage exam marks and view student results
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <span>Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-info"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        {exams.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-text-heading">{stats.total}</p>
                  <p className="text-xs text-text-secondary">Total Exams</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                  <p className="text-xs text-text-secondary">Active Exams</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>
            <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.upcoming}</p>
                  <p className="text-xs text-text-secondary">Upcoming</p>
                </div>
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              </div>
            </div>
            <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-info">{stats.completed}</p>
                  <p className="text-xs text-text-secondary">Completed</p>
                </div>
                <div className="p-2 bg-info/10 rounded-lg">
                  <ClipboardCheck className="w-5 h-5 text-info" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          actionCell={(row) => <ActionCell row={row} />}
          title="Exams Assigned"
          subtitle="Select an exam to view or enter marks"
          columns={COLUMNS}
          data={filteredExams}
          loading={isLoading}
          rowKey="exam_id"
          emptyMessage="No exams assigned"
          emptyDescription="You don't have any exams assigned yet"
          searchPlaceholder="Search by exam name, class, or status..."
          defaultPageSize={limit}
          pageSizeOptions={[5, 10, 20, 50]}
          serverMode={false}
          page={page}
          total={filteredExams.length}
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onPageChange={setPage}
          onPageSizeChange={(val) => {
            setLimit(val);
            setPage(1);
          }}
        />

        {/* Footer Note */}
        {exams.length > 0 && (
          <div className="text-center pt-2">
            <p className="text-xs text-text-secondary">
              Click on any exam to view or enter marks for students
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarksByStaffPage;



















// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getTeacherExamListQuery } from '../../hooks/useQueryMutations';
// import { ClipboardCheck, ArrowRight, Calendar, BookOpen, Trophy, Clock, Users, Eye } from 'lucide-react';

// const StudentMarksByStaffPage = () => {
//   const navigate = useNavigate();
//   const { data: response, isLoading } = getTeacherExamListQuery();
//   const exams = response?.data?.results || [];

//   const handleViewMarks = (examId, classId, examStatus) => {
//     console.log('Navigating to marks:', { examId, classId, examStatus });
//     navigate(`marks?exam_id=${examId}&class_id=${classId}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-surface-page flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
//           <p className="text-text-secondary mt-4 font-medium">Loading exams...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-surface-page px-4 py-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-text-heading">Exam Portal</h1>
//             <p className="text-sm text-text-secondary mt-0.5">
//               Manage exam marks and view student results
//             </p>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-text-secondary">
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-success"></div>
//               <span>Active</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-warning"></div>
//               <span>Upcoming</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-info"></div>
//               <span>Completed</span>
//             </div>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         {exams.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-surface-card rounded-xl border border-border p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-text-heading">{exams.length}</p>
//                   <p className="text-xs text-text-secondary">Total Exams</p>
//                 </div>
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <BookOpen className="w-5 h-5 text-primary" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-surface-card rounded-xl border border-border p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-success">
//                     {exams.filter(e => e.exam_status === 'active').length}
//                   </p>
//                   <p className="text-xs text-text-secondary">Active Exams</p>
//                 </div>
//                 <div className="p-2 bg-success/10 rounded-lg">
//                   <Trophy className="w-5 h-5 text-success" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-surface-card rounded-xl border border-border p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-warning">
//                     {exams.filter(e => e.exam_status === 'upcoming').length}
//                   </p>
//                   <p className="text-xs text-text-secondary">Upcoming</p>
//                 </div>
//                 <div className="p-2 bg-warning/10 rounded-lg">
//                   <Clock className="w-5 h-5 text-warning" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-surface-card rounded-xl border border-border p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-info">
//                     {exams.filter(e => e.exam_status === 'completed').length}
//                   </p>
//                   <p className="text-xs text-text-secondary">Completed</p>
//                 </div>
//                 <div className="p-2 bg-info/10 rounded-lg">
//                   <Users className="w-5 h-5 text-info" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Exams Grid */}
//         {exams.length === 0 ? (
//           <div className="bg-surface-card rounded-2xl border border-border p-16 text-center">
//             <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-page flex items-center justify-center">
//               <BookOpen className="w-10 h-10 text-text-secondary opacity-40" />
//             </div>
//             <p className="text-text-secondary font-medium">No exams assigned</p>
//             <p className="text-xs text-text-secondary mt-1">You don't have any exams assigned yet</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {exams.map((item) => {
//               const statusColors = {
//                 active: { bg: "bg-success/10", text: "text-success", label: "Active", icon: Trophy },
//                 upcoming: { bg: "bg-warning/10", text: "text-warning", label: "Upcoming", icon: Clock },
//                 completed: { bg: "bg-info/10", text: "text-info", label: "Completed", icon: ClipboardCheck }
//               };
//               const status = statusColors[item.exam_status] || statusColors.upcoming;
//               const StatusIcon = status.icon;

//               return (
//                 <div
//                   key={item.exam_id}
//                   className="group bg-surface-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Header with Class Badge */}
//                   <div className="relative p-6 pb-4">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-14 h-14 rounded-xl bg-surface-page from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
//                           <span className="text-2xl font-bold text-primary">
//                             {item.class.name}
//                           </span>
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-text-heading text-lg">
//                             {item.exam_name}
//                           </h3>
//                           <p className="text-xs text-text-secondary mt-0.5">
//                             Class {item.class.name}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end gap-1">
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
//                           <StatusIcon className="w-3 h-3" />
//                           {status.label}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Exam Details */}
//                     <div className="space-y-2 mt-4">
//                       <div className="flex items-center gap-2 text-xs text-text-secondary">
//                         <Calendar className="w-3.5 h-3.5" />
//                         <span>
//                           {new Date(item.start_date).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })} - {new Date(item.end_date).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                       {item.description && (
//                         <p className="text-xs text-text-secondary line-clamp-2 mt-2">
//                           {item.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Footer with Action Buttons */}
//                   <div className="px-6 pb-6 pt-2">
//                     <button
//                       onClick={() => handleViewMarks(item.exam_id, item.class.id, item.exam_status)}
//                       className={`
//                         w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
//                         flex items-center justify-center gap-2
//                         bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md
//                         group/btn
//                       `}
//                     >
//                       {item.exam_status === 'completed' ? (
//                         <>
//                           <Eye className="w-4 h-4" />
//                           View Results
//                         </>
//                       ) : item.exam_status === 'active' ? (
//                         <>
//                           <ClipboardCheck className="w-4 h-4" />
//                           Enter Marks
//                         </>
//                       ) : (
//                         <>
//                           <Clock className="w-4 h-4" />
//                           View Details
//                         </>
//                       )}
//                       <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//                     </button>
//                   </div>

//                   {/* Progress Bar for Active Exams */}
//                   {item.exam_status === 'active' && (
//                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
//                       <div className="h-full bg-primary w-1/3"></div>
//                     </div>
//                   )}

//                   {/* Status Ribbon for Completed Exams */}
//                   {item.exam_status === 'completed' && (
//                     <div className="absolute top-4 right-4">
//                       <div className="bg-info/20 text-info text-[10px] font-bold px-2 py-0.5 rounded-full">
//                         Finalized
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Footer Note */}
//         {exams.length > 0 && (
//           <div className="text-center pt-4">
//             <p className="text-xs text-text-secondary">
//               Click on any exam to view or enter marks for students
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentMarksByStaffPage;