import React, { useState } from 'react';
import { useStudentExamResults } from '../../../hooks/useQueryMutations';
import {
  BookOpen, Calendar, Trophy, TrendingUp, TrendingDown,
  Eye, ChevronDown, ChevronUp, CheckCircle, XCircle,
  Award, Target, Clock, Download, FileText, BarChart3,
  User, GraduationCap, Hash, CreditCard, Printer, MinusCircle
} from 'lucide-react';

const StdExamAndResults = () => {
  const [expandedExam, setExpandedExam] = useState(null);

  const { data: response, isLoading } = useStudentExamResults();
  const results = response?.data?.results;
  const student = results?.student || {};
  const exams = results?.exams || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-text-secondary mt-4 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!exams.length) {
    return (
      <div className="min-h-screen bg-surface-page px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-card rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-page flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-text-secondary opacity-40" />
            </div>
            <p className="text-text-secondary font-medium">No results found</p>
            <p className="text-xs text-text-secondary mt-1">No exam results available yet</p>
          </div>
        </div>
      </div>
    );
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-primary";
    if (percentage >= 60) return "text-info";
    if (percentage >= 45) return "text-warning";
    return "text-error";
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 75) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 45) return "C";
    if (percentage >= 33) return "D";
    return "F";
  };

  const getGradeDescription = (percentage) => {
    if (percentage >= 90) return "Outstanding";
    if (percentage >= 75) return "Excellent";
    if (percentage >= 60) return "Very Good";
    if (percentage >= 45) return "Good";
    if (percentage >= 33) return "Satisfactory";
    return "Needs Improvement";
  };

  const getResultStatus = (percentage) => {
    if (percentage >= 33) {
      return { label: "Passed", color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: CheckCircle };
    }
    return { label: "Failed", color: "text-error", bg: "bg-error/10", border: "border-error/20", icon: XCircle };
  };

  const getSubjectStatus = (isPassed, hasMarks) => {
    if (isPassed === true) {
      return {
        label: "Passed",
        color: "text-success",
        bg: "bg-success/10",
        icon: CheckCircle,
        border: "border-success/20"
      };
    } else if (isPassed === false) {
      return {
        label: "Failed",
        color: "text-error",
        bg: "bg-error/10",
        icon: XCircle,
        border: "border-error/20"
      };
    } else {
      return {
        label: "Not Declared",
        color: "text-warning",
        bg: "bg-warning/10",
        icon: Clock,
        border: "border-warning/20"
      };
    }
  };

  // Calculate overall performance across all exams
  const totalObtainedAll = exams.reduce((sum, exam) => sum + (exam.total_obtained || 0), 0);
  const totalMaxAll = exams.reduce((sum, exam) => sum + exam.total_max, 0);
  const overallPercentage = totalMaxAll > 0 ? (totalObtainedAll / totalMaxAll) * 100 : 0;
  const overallStatus = getResultStatus(overallPercentage);
  const OverallIcon = overallStatus.icon;

  // Calculate subject-wise performance across all exams
  const allSubjects = {};
  exams.forEach(exam => {
    exam.subjects.forEach(subject => {
      if (!allSubjects[subject.subject_name]) {
        allSubjects[subject.subject_name] = {
          total_obtained: 0,
          total_max: 0,
          count: 0,
          passedCount: 0,
          failedCount: 0,
          notDeclaredCount: 0,
          exams: []
        };
      }
      allSubjects[subject.subject_name].exams.push({
        exam_name: exam.exam_name,
        marks_obtained: subject.marks_obtained,
        max_marks: subject.max_marks,
        is_passed: subject.is_passed
      });

      if (subject.marks_obtained !== null) {
        allSubjects[subject.subject_name].total_obtained += subject.marks_obtained;
        allSubjects[subject.subject_name].total_max += subject.max_marks;
        allSubjects[subject.subject_name].count++;
        if (subject.is_passed === true) {
          allSubjects[subject.subject_name].passedCount++;
        } else if (subject.is_passed === false) {
          allSubjects[subject.subject_name].failedCount++;
        }
      } else {
        allSubjects[subject.subject_name].notDeclaredCount++;
      }
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface-page px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">My Academic Results</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Track your exam performance and progress
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-card border border-border text-text-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm font-medium">Print Results</span>
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {student.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-heading">{student.name}</h2>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                    <GraduationCap className="w-3 h-3" />
                    Class {student.class?.name} - Section {student.section?.name}
                  </span>
                  <span className="text-xs text-text-secondary">•</span>
                  <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                    <Hash className="w-3 h-3" />
                    Roll No: {student.roll_number}
                  </span>
                  <span className="text-xs text-text-secondary">•</span>
                  <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                    <CreditCard className="w-3 h-3" />
                    Admission: {student.admission_number}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl ${overallStatus.bg} border ${overallStatus.border}`}>
                <div className="flex items-center gap-2">
                  <OverallIcon className={`w-4 h-4 ${overallStatus.color}`} />
                  <span className={`text-sm font-semibold ${overallStatus.color}`}>
                    Overall {overallStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-text-heading">{exams.length}</p>
                <p className="text-xs text-text-secondary">Total Exams</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{totalObtainedAll}</p>
                <p className="text-xs text-text-secondary">Total Marks Obtained</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <Award className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
          <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-info">{totalMaxAll}</p>
                <p className="text-xs text-text-secondary">Total Maximum Marks</p>
              </div>
              <div className="p-2 bg-info/10 rounded-lg">
                <Target className="w-5 h-5 text-info" />
              </div>
            </div>
          </div>
          <div className="bg-surface-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${getGradeColor(overallPercentage)}`}>
                  {overallPercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-text-secondary">Overall Percentage</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-heading">Exam-wise Results</h3>
              <p className="text-xs text-text-secondary mt-0.5">Detailed marks for each exam</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span>Failed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span>Not Declared</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {exams.map((exam, examIdx) => {
              const totalPercentage = (exam.total_obtained / exam.total_max) * 100;
              const resultStatus = getResultStatus(totalPercentage);
              const ResultIcon = resultStatus.icon;
              const passedSubjects = exam.subjects.filter(s => s.is_passed === true).length;
              const failedSubjects = exam.subjects.filter(s => s.is_passed === false).length;
              const pendingSubjects = exam.subjects.filter(s => s.marks_obtained === null).length;
              const gradeLetter = getGradeLetter(totalPercentage);
              const gradeDesc = getGradeDescription(totalPercentage);

              return (
                <div key={exam.exam_id} className="bg-surface-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
                  {/* Exam Header */}
                  <div className="p-6 bg-gradient-to-r from-surface-page to-white border-b border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-text-heading">{exam.exam_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                          <span className="text-xs text-text-secondary">
                            {new Date(exam.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(exam.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${resultStatus.bg} ${resultStatus.color}`}>
                        <ResultIcon className="w-3 h-3" />
                        {resultStatus.label}
                      </span>
                    </div>

                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-text-heading">{exam.total_obtained || 0}</p>
                        <p className="text-xs text-text-secondary">Obtained</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-text-heading">{exam.total_max}</p>
                        <p className="text-xs text-text-secondary">Total</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${getGradeColor(totalPercentage)}`}>
                          {totalPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-text-secondary">Percentage</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{gradeLetter}</p>
                        <p className="text-xs text-text-secondary">Grade</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-text-heading">{gradeDesc}</p>
                        <p className="text-xs text-text-secondary">Remarks</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject Performance Table */}
                  <div className="p-6">
                    <button
                      onClick={() => setExpandedExam(expandedExam === examIdx ? null : examIdx)}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-text-heading">Subject-wise Marks</span>
                        <div className="flex gap-1 ml-2">
                          {passedSubjects > 0 && (
                            <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded">
                              {passedSubjects} Passed
                            </span>
                          )}
                          {failedSubjects > 0 && (
                            <span className="text-xs text-error bg-error/10 px-1.5 py-0.5 rounded">
                              {failedSubjects} Failed
                            </span>
                          )}
                          {pendingSubjects > 0 && (
                            <span className="text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                              {pendingSubjects} Not Declared
                            </span>
                          )}
                        </div>
                      </div>
                      {expandedExam === examIdx ? (
                        <ChevronUp className="w-4 h-4 text-text-secondary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-secondary" />
                      )}
                    </button>

                    {expandedExam === examIdx && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-surface-page border-b border-border">
                              <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Subject</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Marks Obtained</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Max Marks</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Percentage</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Pass Marks</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {exam.subjects.map((subject, subIdx) => {
                              const subjectStatus = getSubjectStatus(subject.is_passed, subject.marks_obtained !== null);
                              const StatusIcon = subjectStatus.icon;
                              const hasMarks = subject.marks_obtained !== null;
                              const percentage = hasMarks ? (subject.marks_obtained / subject.max_marks) * 100 : 0;

                              return (
                                <tr key={subIdx} className="hover:bg-surface-page/30 transition-colors">
                                  <td className="px-4 py-3 font-medium text-text-heading">
                                    {subject.subject_name}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {hasMarks ? (
                                      <span className={`font-bold ${subject.is_passed ? 'text-success' : 'text-error'}`}>
                                        {subject.marks_obtained}
                                      </span>
                                    ) : (
                                      <span className="text-text-secondary">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-text-secondary">
                                    {subject.max_marks}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {hasMarks ? (
                                      <span className={`font-medium ${subject.is_passed ? 'text-success' : 'text-error'}`}>
                                        {percentage.toFixed(1)}%
                                      </span>
                                    ) : (
                                      <span className="text-text-secondary">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-text-secondary">
                                    {subject.pass_marks}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${subjectStatus.bg} ${subjectStatus.color}`}>
                                      <StatusIcon className="w-3 h-3" />
                                      {subjectStatus.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Performance Bar */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-secondary">Exam Performance</span>
                        <span className="font-semibold text-text-heading">{totalPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500 bg-primary"
                          style={{ width: `${totalPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-text-secondary">Failed: {failedSubjects}</span>
                        <span className="text-text-secondary">Passed: {passedSubjects}</span>
                        <span className="text-text-secondary">Pending: {pendingSubjects}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-wise Performance Summary Across All Exams */}
        {Object.keys(allSubjects).length > 0 && (
          <div className="bg-surface-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-surface-page to-white border-b border-border">
              <h3 className="font-semibold text-text-heading">Subject-wise Performance Summary</h3>
              <p className="text-xs text-text-secondary mt-0.5">Performance across all exams</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-page border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Subject</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Obtained</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Max</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Average %</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Passed</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Failed</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Not Declared</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(allSubjects).map(([subjectName, data]) => {
                    const averagePercentage = data.total_max > 0 ? (data.total_obtained / data.total_max) * 100 : 0;
                    const isPassed = averagePercentage >= 33;
                    const hasData = data.count > 0;

                    return (
                      <tr key={subjectName} className="hover:bg-surface-page/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-text-heading">
                          {subjectName}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-text-primary">
                          {data.total_obtained}
                        </td>
                        <td className="px-6 py-4 text-center text-text-secondary">
                          {data.total_max}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasData ? (
                            <span className={`font-semibold ${isPassed ? 'text-success' : 'text-error'}`}>
                              {averagePercentage.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-text-secondary">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-success font-medium">{data.passedCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-error font-medium">{data.failedCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-warning font-medium">{data.notDeclaredCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasData ? (
                            isPassed ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                                <CheckCircle className="w-3 h-3" />
                                Passing
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                                <XCircle className="w-3 h-3" />
                                Needs Improvement
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Insights */}
        {exams.length > 1 && (
          <div className="bg-gradient-to-br from-primary/5 via-info/5 to-transparent rounded-2xl p-6 border border-primary/10">
            <h3 className="font-semibold text-text-heading mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-text-heading">Best Performance</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {Math.max(...exams.map(e => (e.total_obtained / e.total_max) * 100)).toFixed(1)}%
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {exams.find(e => ((e.total_obtained / e.total_max) * 100) === Math.max(...exams.map(e => (e.total_obtained / e.total_max) * 100)))?.exam_name}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-warning" />
                  <span className="text-sm font-medium text-text-heading">Area of Improvement</span>
                </div>
                <p className="text-2xl font-bold text-warning">
                  {Math.min(...exams.map(e => (e.total_obtained / e.total_max) * 100)).toFixed(1)}%
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {exams.find(e => ((e.total_obtained / e.total_max) * 100) === Math.min(...exams.map(e => (e.total_obtained / e.total_max) * 100)))?.exam_name}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-text-heading">Strongest Subject</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {Object.entries(allSubjects).sort((a, b) =>
                    (b[1].total_obtained / b[1].total_max) - (a[1].total_obtained / a[1].total_max)
                  )[0]?.[0] || 'N/A'}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Highest scoring subject
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StdExamAndResults;