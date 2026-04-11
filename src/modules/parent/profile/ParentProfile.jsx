import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Users,
  CalendarDays,
  MapPin,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { useParentProfile } from "../../../hooks/useQueryMutations";

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-6">
    <div className="h-20 bg-surface-card rounded-2xl border border-border"></div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="col-span-1 flex flex-col gap-6">
        <div className="h-[400px] bg-surface-card rounded-2xl border border-border"></div>
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <div className="h-40 bg-surface-card rounded-2xl border border-border"></div>
        <div className="h-40 bg-surface-card rounded-2xl border border-border"></div>
      </div>
    </div>
  </div>
);

// ─── INFO ROW HELPER ──────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon: Icon, isEmail }) => (
  <div className="flex items-start gap-3 text-sm py-1">
    {Icon && (
      <div className="mt-0.5 p-1.5 bg-primary/5 rounded-lg text-text-secondary">
        <Icon size={16} />
      </div>
    )}
    <div>
      <span className="text-text-secondary block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
        {label}
      </span>
      <span
        className={`font-medium ${isEmail ? "text-primary lowercase" : "text-text-primary capitalize"}`}
      >
        {value || "Not Provided"}
      </span>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ParentProfile() {
  // Fetch Parent Profile API
  const { data: response, isLoading } = useParentProfile();

  const parent = response?.data;
  const childrenList = parent?.children || [];

  console.log(parent, childrenList)
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="p-6 lg:p-8 min-h-screen bg-surface-page flex flex-col items-center justify-center text-center animate-fadeUp">
        <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center mb-4 border border-border shadow-sm">
          <User className="text-text-secondary opacity-50" size={32} />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">
          Profile Not Found
        </h3>
        <p className="text-sm text-text-secondary max-w-sm">
          We could not load your profile information. Please contact the school
          administration.
        </p>
      </div>
    );
  }

  // Get primary initials for the avatar
  const initials = parent.guardianName
    ? parent.guardianName.substring(0, 2).toUpperCase()
    : parent.fatherName
      ? parent.fatherName.substring(0, 2).toUpperCase()
      : "PR";

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
          <User className="text-primary" size={24} />
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your contact information and view your  children.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* ─── LEFT COLUMN: PARENT DETAILS ─── */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Main ID Card */}
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
            {/* Top color block */}
            <div className="h-24 bg-gradient-to-r from-primary/80 to-primary/40 relative">
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-surface-page/10 rounded-full blur-2xl"></div>
            </div>

            <div className="px-6 pb-6 relative">
              {/* Avatar overlapping header */}
              <div className="absolute -top-20 left-6 w-20 h-20 rounded-2xl bg-surface-page border-4 border-surface-card flex items-center justify-center shadow-sm">
                <div className="w-full h-full rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-['Montserrat'] font-bold">
                  {initials}
                </div>
              </div>

              <div className="mt-12 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-text-heading capitalize">
                    {parent.guardianName || parent.fatherName}
                  </h2>
                  <p className="text-xs text-text-secondary font-medium">
                    Primary Guardian
                  </p>
                </div>
                {parent.isActive && (
                  <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-success/20">
                    <ShieldCheck size={12} /> Active
                  </span>
                )}
              </div>

              <div className="mt-8 space-y-4 border-t border-border/50 pt-5">
                <InfoRow
                  label="Email Address"
                  value={parent.email}
                  icon={Mail}
                  isEmail
                />
                <InfoRow
                  label="Mobile Number"
                  value={parent.phone ? `+91 ${parent.phone}` : null}
                  icon={Phone}
                />
                <InfoRow
                  label="Father's Name"
                  value={parent.fatherName}
                  icon={User}
                />
                <InfoRow
                  label="Mother's Name"
                  value={parent.motherName}
                  icon={User}
                />
                <InfoRow
                  label="Member Since"
                  value={new Date(parent.createdAt).toLocaleDateString(
                    "en-GB",
                    { month: "long", year: "numeric" },
                  )}
                  icon={CalendarDays}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: LINKED CHILDREN ─── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-primary" size={20} />
            <h3 className="text-lg font-['Montserrat'] font-bold text-text-heading">
              Children ({parent.childrenCount})
            </h3>
          </div>

          {childrenList.length > 0 ? (
            <div className="grid gap-4">
              {childrenList.map((child) => (
                <div
                  key={child.studentId}
                  className="group bg-surface-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle accent line on the left */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Child Avatar & Name */}
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <div className="w-14 h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-lg uppercase border border-primary/10">
                        {child.firstName?.charAt(0)}
                        {child.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-text-primary capitalize group-hover:text-primary transition-colors">
                          {child.firstName} {child.lastName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-semibold text-text-secondary bg-surface-page px-2 py-0.5 rounded border border-border">
                            {child.admissionNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider for mobile */}
                    <div className="w-full h-px bg-border/50 sm:hidden"></div>

                    {/* Details Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4 w-full">
                      <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                        <GraduationCap size={14} className="text-primary/70" />
                        <span className="capitalize">
                          {child.gender || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                        <CalendarDays size={14} className="text-primary/70" />
                        <span>
                          DOB:{" "}
                          {child.dob
                            ? new Date(child.dob).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-text-secondary col-span-2">
                        <MapPin
                          size={14}
                          className="text-primary/70 flex-shrink-0"
                        />
                        <span className="truncate">
                          {child.address || "Address not provided"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden sm:flex self-start">
                      {child.isActive && (
                        <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest border border-success/20">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-card border border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 bg-surface-page rounded-full flex items-center justify-center mb-4 border border-border">
                <Users className="text-text-secondary opacity-60" size={28} />
              </div>
              <h3 className="text-[16px] font-bold text-text-primary mb-1">
                No Children
              </h3>
              <p className="text-sm text-text-secondary max-w-[280px]">
                There are currently no students to this parent account.
                Please contact the administration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
