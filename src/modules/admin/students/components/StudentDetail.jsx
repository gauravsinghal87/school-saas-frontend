import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Trash2,
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  BookOpen,
  User,
  Users,
  MapPin,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import api from "../../../../api/apiConfig"; // Adjust path if necessary

import Input from "../../../../components/common/Input";
import SubmitButton from "../../../../components/common/Button";
import {
  useStudentDetail,
  useUploadStudentDocumentsMutation,
} from "../../../../hooks/useQueryMutations";

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-6">
    <div className="h-20 bg-surface-card rounded-2xl border border-border"></div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="h-48 bg-surface-card rounded-2xl border border-border"></div>
        <div className="h-48 bg-surface-card rounded-2xl border border-border"></div>
        <div className="h-48 bg-surface-card rounded-2xl border border-border"></div>
      </div>
      <div className="col-span-2 flex flex-col gap-6">
        <div className="h-32 bg-surface-card rounded-2xl border border-border"></div>
        <div className="h-96 bg-surface-card rounded-2xl border border-border"></div>
      </div>
    </div>
  </div>
);

// ─── INFO ROW HELPER ──────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 text-sm">
    {Icon && (
      <Icon size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
    )}
    <div>
      <span className="text-text-secondary block text-xs mb-0.5">{label}</span>
      <span className="font-semibold text-text-primary capitalize">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

// ─── STUDENT DETAIL & DOCUMENT COMPONENT ──────────────────────────────────────

function StudentDetail({ studentId, onBack }) {

  const { data: res, isLoading } = useStudentDetail(studentId);
  const student = res?.data?.student;
  const userId = student?.userId;

  // Document Upload States
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const addCertificateField = () =>
    setCertificates([...certificates, { file: null, type: "" }]);
  const removeCertificateField = (index) =>
    setCertificates(certificates.filter((_, i) => i !== index));

  const uploadDocsMutation = useUploadStudentDocumentsMutation(
    studentId,
    userId,
  );

  const handleUpload = (e) => {
    e.preventDefault();

    if (!aadhar && !pan && certificates.length === 0) {
      return;
    }

    const formData = new FormData();

    if (aadhar) formData.append("aadhar_card", aadhar);
    if (pan) formData.append("pan_card", pan);

    let certValid = true;

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      if (cert.file && !cert.type) {
        certValid = false;
        break;
      }

      if (cert.file && cert.type) {
        formData.append("certificates", cert.file);
        formData.append("certificate_types", cert.type);
      }
    }

    if (!certValid) return;

    uploadDocsMutation.mutate({ formData });
  };

  if (isLoading) return <DetailSkeleton />;
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary gap-4 animate-fadeUp">
        <span className="text-4xl">📭</span>
        <p className="font-medium">Student information could not be found.</p>
        <button
          onClick={onBack}
          className="text-primary hover:underline font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Safe Extraction of deeply nested fields
  const enrollment = student.currentEnrollment || {};
  const parent = Array.isArray(student.parents)
    ? student.parents[0]
    : student.parents || {};
  const docs = student.documents || {};

  return (
    <div className="animate-fadeUp flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 bg-surface-card p-4 rounded-2xl border border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2.5 bg-surface-page border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase flex-shrink-0">
            {student.firstName?.substring(0, 1)}
            {student.lastName?.substring(0, 1)}
          </div>
          <div>
            <h2 className="text-xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
              {student.firstName} {student.lastName}
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${student.isActive ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
              >
                {student.isActive ? "Active" : "Inactive"}
              </span>
            </h2>
            <p className="text-sm text-text-secondary font-medium">
              Admission No:{" "}
              <span className="text-text-primary">
                {student.admissionNumber || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* ─── LEFT COLUMN: STUDENT DATA ─── */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Academic Info Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-primary flex items-center gap-2 uppercase tracking-wider mb-4 border-b border-border pb-2.5">
              <BookOpen size={16} /> Academic Profile
            </h3>
            <div className="space-y-4">
              <InfoRow
                label="Class & Section"
                value={`Class ${enrollment.class?.name || "N/A"} - ${enrollment.section?.name || "N/A"}`}
              />
              <InfoRow
                label="Academic Session"
                value={enrollment.session?.academicSession}
              />
              <InfoRow label="Roll Number" value={enrollment.rollNumber} />
              <InfoRow label="Previous School" value={student.previousSchool} />
              <InfoRow
                label="Admission Date"
                value={new Date(student.createdAt).toLocaleDateString("en-GB")}
              />
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-primary flex items-center gap-2 uppercase tracking-wider mb-4 border-b border-border pb-2.5">
              <User size={16} /> Personal Info
            </h3>
            <div className="space-y-4">
              <InfoRow
                label="Date of Birth"
                icon={Calendar}
                value={
                  student.dob
                    ? new Date(student.dob).toLocaleDateString("en-GB")
                    : null
                }
              />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow
                label="Student Email"
                icon={Mail}
                value={student.user?.email}
              />
              <InfoRow
                label="Student Phone"
                icon={Phone}
                value={student.user?.phone ? `+91 ${student.user.phone}` : null}
              />
              <InfoRow label="Address" icon={MapPin} value={student.address} />
            </div>
          </div>

          {/* Parent/Guardian Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-primary flex items-center gap-2 uppercase tracking-wider mb-4 border-b border-border pb-2.5">
              <Users size={16} /> Parent / Guardian
            </h3>
            <div className="space-y-4">
              <InfoRow label="Father's Name" value={parent.fatherName} />
              <InfoRow label="Mother's Name" value={parent.motherName} />
              <InfoRow
                label={`Primary Guardian (${parent.relation || "N/A"})`}
                value={parent.guardianName}
              />
              <InfoRow
                label="Guardian Email"
                icon={Mail}
                value={parent.email}
              />
              <InfoRow
                label="Guardian Phone"
                icon={Phone}
                value={parent.phone ? `+91 ${parent.phone}` : null}
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: DOCUMENTS PORTAL ─── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Uploaded Documents Tracker */}
          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-primary flex items-center gap-2 uppercase tracking-wider mb-4 border-b border-border pb-2.5">
              <CheckCircle2 size={16} /> Existing Documents
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {docs?.documents?.aadhar_card?.file_url && (
                <a
                  href={docs?.documents?.aadhar_card?.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-success hover:bg-success/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-semibold text-text-primary group-hover:text-success transition-colors">
                    Aadhar Card
                  </span>
                </a>
              )}

              {docs?.documents?.pan_card?.file_url && (
                <a
                  href={docs?.documents?.pan_card.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-success hover:bg-success/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-semibold text-text-primary group-hover:text-success transition-colors">
                    PAN Card
                  </span>
                </a>
              )}

              {docs?.documents?.certificates?.map((cert) => (
                <a
                  key={cert._id}
                  href={cert.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {cert.certificate_type}
                    </span>
                    <span className="text-[10px] text-text-secondary uppercase">
                      Certificate
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {!docs?.documents?.aadhar_card &&
              !docs?.documents?.pan_card &&
              (!docs?.documents?.certificates ||
                docs?.documents?.certificates.length === 0) && (
                <div className="flex flex-col items-center justify-center py-6 bg-surface-page border border-dashed border-border rounded-xl">
                  <FileText className="text-text-secondary mb-2" size={24} />
                  <p className="text-xs text-text-secondary font-medium">
                    No documents have been uploaded yet.
                  </p>
                </div>
              )}
          </div>

          {/* New Document Uploader Form */}
          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <UploadCloud size={20} />
              </div>
              <h3 className="text-lg font-['Montserrat'] font-bold text-text-heading">
                Upload New Documents
              </h3>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    Aadhar Card
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setAadhar(e.target.files[0])}
                    className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-page p-1.5 outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    PAN Card (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setPan(e.target.files[0])}
                    className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-page p-1.5 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-2 border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-text-primary">
                    Other Certificates (Transfer Cert, Marksheets)
                  </label>
                  <button
                    type="button"
                    onClick={addCertificateField}
                    className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    + Add Certificate
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {certificates.length === 0 && (
                    <p className="text-xs text-text-secondary">
                      Click '+ Add Certificate' to dynamically upload additional
                      educational records.
                    </p>
                  )}
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-surface-page border border-border rounded-xl animate-fadeUp"
                    >
                      <div className="w-full sm:flex-1">
                        <Input
                          label="Document Type"
                          required
                          value={cert.type}
                          onChange={(e) => {
                            const newCerts = [...certificates];
                            newCerts[index].type = e.target.value;
                            setCertificates(newCerts);
                          }}
                          placeholder="e.g. TC, 5th Marksheet"
                        />
                      </div>
                      <div className="w-full sm:flex-1 pt-1">
                        <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase tracking-wider">
                          File
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => {
                            const newCerts = [...certificates];
                            newCerts[index].file = e.target.files[0];
                            setCertificates(newCerts);
                          }}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-card file:text-text-primary file:border file:border-border hover:file:bg-border/50 transition-all cursor-pointer border border-border rounded-xl bg-surface-card p-1 outline-none focus:border-primary h-[44px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertificateField(index)}
                        className="p-3 mt-1 sm:mt-5 text-error bg-error/10 hover:bg-error/20 rounded-xl transition-colors cursor-pointer"
                        title="Remove Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-border">
                <div className="w-[200px]">
                  <SubmitButton
                    loading={uploadDocsMutation.isPending}
                    label="Upload Documents"
                    loadingLabel="Uploading..."
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
