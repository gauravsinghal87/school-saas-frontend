import React, { useState } from "react";
import { User, Briefcase, MapPin, Mail, Phone, BookOpen, Award, FileCheck, Eye, Download } from "lucide-react";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import FormGroup from "../../../components/common/Formgroup";
import { useUser } from "../../../hooks/useUser";

export default function TeacherProfile() {
    const { user: authUser } = useUser();
    const [viewingDocument, setViewingDocument] = useState(null);

    // Extract data from API response
    const profile = authUser?.data || authUser || {};
    const contact = profile.contact || {};
    const userInfo = profile.user || {};
    const documents = profile.documents || {};
    const certificates = documents.certificates || [];

    const handleViewDocument = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-surface-page p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* HEADER SECTION */}
                <div className="flex items-center justify-between bg-surface-page p-6 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-heading">
                                {userInfo.name || "Teacher Profile"}
                            </h1>
                            <p className="text-primary font-bold text-sm uppercase tracking-wider">
                                {profile.designation || "Teacher"} • {profile.department || "N/A"}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${profile.status === 'active'
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-error/10 text-error border-error/20"
                                    }`}>
                                    {profile.status || "Inactive"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                                    ID: {profile.employee_id || "PENDING"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">
                                    {profile.role?.name || "TEACHER"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* PROFESSIONAL DETAILS */}
                    <Card className="h-full">
                        <div className="flex items-center gap-2 mb-4 text-primary border-b border-border pb-3">
                            <Briefcase size={18} />
                            <h2 className="font-bold uppercase text-xs tracking-widest">Professional Info</h2>
                        </div>
                        <div className="space-y-4">
                            <Input
                                label="Employee ID"
                                value={profile.employee_id || "N/A"}
                                readOnly
                            />
                            <Input
                                label="Qualification"
                                value={profile.qualification || "N/A"}
                                readOnly
                            />
                            <Input
                                label="Experience"
                                value={profile.experience ? `${profile.experience} Years` : "N/A"}
                                readOnly
                            />
                            <Input
                                label="Salary"
                                value={profile.salary ? `₹${profile.salary.toLocaleString()}` : "Confidential"}
                                readOnly
                            />

                            <FormGroup label="Subjects Assigned">
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {profile.subjects?.length > 0 ? (
                                        profile.subjects.map((sub) => (
                                            <span key={sub._id} className="bg-primary/5 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold">
                                                {sub.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-text-secondary italic">No subjects assigned</span>
                                    )}
                                </div>
                            </FormGroup>

                            <FormGroup label="Class Teacher Of">
                                <div className="pt-1 space-y-2">
                                    {profile.classTeacherOf?.length > 0 ? (
                                        profile.classTeacherOf.map((cls) => (
                                            <div key={cls._id} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
                                                <span>Class {cls.class?.name} - Section {cls.name}</span>
                                                <Award size={14} />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-text-secondary italic">No class assigned</span>
                                    )}
                                </div>
                            </FormGroup>
                        </div>
                    </Card>

                    {/* CONTACT & PERSONAL */}
                    <Card className="h-full">
                        <div className="flex items-center gap-2 mb-4 text-primary border-b border-border pb-3">
                            <MapPin size={18} />
                            <h2 className="font-bold uppercase text-xs tracking-widest">Contact Details</h2>
                        </div>
                        <div className="space-y-4">
                            <Input
                                label="Official Email"
                                value={userInfo.email || "N/A"}
                                readOnly
                                icon={<Mail size={16} />}
                            />
                            <Input
                                label="Personal Email"
                                value={contact.personal_email || "N/A"}
                                readOnly
                            />
                            <Input
                                label="Work Phone"
                                value={userInfo.phone || "N/A"}
                                readOnly
                                icon={<Phone size={16} />}
                            />
                            <Input
                                label="Personal Phone"
                                value={contact.phone || "N/A"}
                                readOnly
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="City" value={contact.city || "N/A"} readOnly />
                                <Input label="State" value={contact.state || "N/A"} readOnly />
                            </div>
                            <Input label="Address" value={contact.address || "N/A"} readOnly />
                            <Input label="Country" value={contact.country || "India"} readOnly />
                        </div>
                    </Card>

                </div>

                {/* DOCUMENTS SECTION */}
                <Card>
                    <div className="flex items-center gap-2 mb-4 text-primary border-b border-border pb-3">
                        <BookOpen size={18} />
                        <h2 className="font-bold uppercase text-xs tracking-widest">KYC Documents</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DocumentStatus
                            label="Aadhaar Card"
                            isUploaded={!!documents.aadhar_card}
                            fileUrl={documents.aadhar_card?.file_url}
                            onView={handleViewDocument}
                        />
                        <DocumentStatus
                            label="PAN Card"
                            isUploaded={!!documents.pan_card}
                            fileUrl={documents.pan_card?.file_url}
                            onView={handleViewDocument}
                        />
                        <DocumentStatus
                            label="Certificates"
                            isUploaded={certificates.length > 0}
                            count={certificates.length}
                            certificates={certificates}
                            onView={handleViewDocument}
                        />
                    </div>
                </Card>

            </div>
        </div>
    );
}

// Document Status Component with View capability
function DocumentStatus({ label, isUploaded, count, fileUrl, certificates, onView }) {
    const [showCertificates, setShowCertificates] = useState(false);

    if (label === "Certificates" && isUploaded) {
        return (
            <div className="p-4 rounded-2xl bg-surface-page border border-border">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <FileCheck size={18} className="text-success" />
                        <span className="text-sm font-medium text-text-secondary">{label}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-success/10 text-success">
                        {count} Files
                    </span>
                </div>
                <button
                    onClick={() => setShowCertificates(!showCertificates)}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                >
                    <Eye size={12} />
                    {showCertificates ? "Hide" : `View ${count} Certificate${count > 1 ? 's' : ''}`}
                </button>
                {showCertificates && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                        {certificates.map((cert, idx) => (
                            <div key={cert._id} className="flex items-center justify-between p-2 bg-surface-page rounded-lg border border-border">
                                <span className="text-xs text-text-secondary truncate flex-1">
                                    {cert.certificate_type || `Certificate ${idx + 1}`}
                                </span>
                                <button
                                    onClick={() => onView(cert.file_url)}
                                    className="p-1 hover:bg-primary/10 rounded-md transition-colors"
                                    title="View Document"
                                >
                                    <Eye size={14} className="text-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 rounded-2xl bg-surface-page border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileCheck size={18} className={isUploaded ? "text-success" : "text-slate-300"} />
                <span className="text-sm font-medium text-text-secondary">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${isUploaded ? "bg-success/10 text-success" : "bg-error/10 text-error"
                    }`}>
                    {isUploaded ? "Verified" : "Missing"}
                </span>
                {isUploaded && fileUrl && (
                    <button
                        onClick={() => onView(fileUrl)}
                        className="p-1 hover:bg-primary/10 rounded-md transition-colors"
                        title="View Document"
                    >
                        <Eye size={14} className="text-primary" />
                    </button>
                )}
            </div>
        </div>
    );
}