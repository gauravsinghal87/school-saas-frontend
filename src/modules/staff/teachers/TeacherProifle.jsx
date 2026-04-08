import React from "react";
import { User, Briefcase, MapPin, Mail, Phone, BookOpen, Award, FileCheck } from "lucide-react";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import FormGroup from "../../../components/common/Formgroup";
import { useUser } from "../../../hooks/useUser";

export default function TeacherProfile() {
    const { user: authUser } = useUser();

    // Depending on your auth implementation, the teacher data might be 
    // the object itself or nested inside authUser.data
    const profile = authUser || {};

    // Helper to handle nested data safely
    const contact = profile.contact || {};
    const userInfo = profile.user || {};
    const docs = profile.documents || {};

    return (
        <div className="min-h-screen bg-[var(--color-surface-page)] p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER SECTION */}
                <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-[var(--color-border)] shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
                                {userInfo.name || "Teacher Profile"}
                            </h1>
                            <p className="text-primary font-bold text-sm uppercase tracking-wider">
                                {profile.designation || "Staff"} • {profile.department || "N/A"}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${profile.status === 'active'
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-error/10 text-error border-error/20"
                                    }`}>
                                    {profile.status || "Inactive"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                                    ID: {profile.employee_id || "PENDING"}
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
                            <Input label="Qualification" value={profile.qualification || "N/A"} readOnly />
                            <Input label="Experience" value={profile.experience ? `${profile.experience} Years` : "N/A"} readOnly />
                            <Input label="Salary" value={profile.salary ? `₹${profile.salary.toLocaleString()}` : "Confidential"} readOnly />

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
                            <Input label="Official Email" value={userInfo.email} readOnly icon={<Mail size={16} />} />
                            <Input label="Personal Email" value={contact.personal_email || "N/A"} readOnly />
                            <Input label="Work Phone" value={userInfo.phone} readOnly icon={<Phone size={16} />} />
                            <Input label="Personal Phone" value={contact.phone || "N/A"} readOnly />

                            <div className="grid grid-cols-2 gap-3">
                                <Input label="City" value={contact.city || "N/A"} readOnly />
                                <Input label="State" value={contact.state || "N/A"} readOnly />
                            </div>
                            <Input label="Address" value={contact.address || "N/A"} readOnly />
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
                        <DocumentStatus label="Aadhaar Card" isUploaded={!!docs.aadhar_card} />
                        <DocumentStatus label="PAN Card" isUploaded={!!docs.pan_card} />
                        <DocumentStatus
                            label="Certificates"
                            isUploaded={docs.certificates?.length > 0}
                            count={docs.certificates?.length}
                        />
                    </div>
                </Card>

            </div>
        </div>
    );
}

// Internal Helper for Documents
function DocumentStatus({ label, isUploaded, count }) {
    return (
        <div className="p-4 rounded-2xl bg-slate-50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileCheck size={18} className={isUploaded ? "text-success" : "text-slate-300"} />
                <span className="text-sm font-medium text-text-secondary">{label}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${isUploaded ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}>
                {isUploaded ? (count ? `${count} Files` : "Verified") : "Missing"}
            </span>
        </div>
    );
}