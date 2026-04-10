import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    getTeacherExamSubjectsQuery,
    getTeacherExamStudentsQuery,
    updateTeacherExamMarksMutation
} from '../../hooks/useQueryMutations';
import { Save, Info, CheckCircle, Target } from 'lucide-react';

const GiveExamMarkorUpload = () => {
    const [params] = useSearchParams();
    const exam_id = params.get('exam_id');
    const class_id = params.get('class_id');

    const [subject_id, setSubjectId] = useState('');
    const [marksData, setMarksData] = useState({});

    // API Queries
    const { data: subjectRes } = getTeacherExamSubjectsQuery({ examId: exam_id, classId: class_id });
    const { data: studentRes } = getTeacherExamStudentsQuery({ examId: exam_id, classId: class_id, subjectId: subject_id });

    // Mutation
    const updateMutation = updateTeacherExamMarksMutation();

    // Find details of the selected subject (Max/Pass marks)
    const selectedSubjectDetail = useMemo(() => {
        return subjectRes?.data?.results?.find(s => s.subject_id === subject_id);
    }, [subjectRes, subject_id]);

    const handleSave = () => {
        // Construct payload exactly as required by Step 4
        const payload = {
            exam_id,
            class_id,
            subject_id,
            marks: Object.entries(marksData).map(([id, val]) => ({
                student_id: id,
                marks: Number(val)
            }))
        };

        if (payload.marks.length === 0) return alert("Please enter marks first");
        updateMutation.mutate(payload);
    };

    console.log("Subjects:", subject_id);

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-10">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header & Subject Selector */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-800 italic">MARKS ENTRY WORKROOM</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select subject to load students</p>
                        </div>
                        <select
                            className="w-full md:w-64 p-4 rounded-2xl bg-slate-100 border-none font-black text-xs outline-none ring-2 ring-transparent focus:ring-primary"
                            value={subject_id}
                            onChange={(e) => setSubjectId(e.target.value)}
                        >
                            <option value="">Choose Subject</option>
                            {subjectRes?.data?.results?.map(sub => (
                                <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* --- Subject Info Bar (Max/Pass Marks) --- */}
                    {selectedSubjectDetail && (
                        <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Max Marks:</span>
                                <span className="text-sm font-black text-primary">{selectedSubjectDetail.max_marks}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-slate-200 self-center"></div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Pass Marks:</span>
                                <span className="text-sm font-black text-green-600">{selectedSubjectDetail.pass_marks}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Entry List */}
                {subject_id ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="p-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Score / {selectedSubjectDetail?.max_marks}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {studentRes?.data?.results?.students?.map(stu => (
                                    <tr key={stu.student_id} className="hover:bg-slate-50/30">
                                        <td className="p-5">
                                            <div className="font-black text-slate-800">{stu.name}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">Roll: {stu.roll_number} • {stu.section.name}</div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <input
                                                type="number"
                                                max={selectedSubjectDetail?.max_marks}
                                                className="w-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-primary focus:ring-2 focus:ring-primary outline-none"
                                                onChange={(e) => setMarksData({ ...marksData, [stu.student_id]: e.target.value })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                            <p className="text-[10px] font-bold text-slate-400 italic">Review marks before saving</p>
                            <button
                                onClick={handleSave}
                                disabled={updateMutation.isLoading}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                            >
                                <Save className="w-4 h-4" /> {updateMutation.isLoading ? 'Processing...' : 'Save All Marks'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                        <Info className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">Select a subject to load the student registry.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiveExamMarkorUpload;