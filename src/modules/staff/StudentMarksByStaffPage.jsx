import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherExamListQuery } from '../../hooks/useQueryMutations';
import { ClipboardCheck, ArrowRight, Calendar } from 'lucide-react';

const StudentMarksByStaffPage = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = getTeacherExamListQuery();
  const exams = response?.data?.results || [];

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-primary">LOADING EXAMS...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">EXAM PORTAL</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Step 0: Select assigned exam and class</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((item) => (
            <div key={item.exam_id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-primary transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic">
                  {item.class.name}
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase">
                  {item.exam_status}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-2">{item.exam_name}</h3>
              <div className="space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => navigate(`marks?exam_id=${item.exam_id}&class_id=${item.class.id}`)}
                className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Select Subjects <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentMarksByStaffPage;