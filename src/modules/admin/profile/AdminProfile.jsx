import React from 'react';
import { getAdminProfileMutation } from "../../../hooks/useQueryMutations";
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaSchool, 
  FaCalendarAlt,
  FaCheckCircle,
  FaUserShield,
  FaIdCard,
  FaBuilding,
  FaRegClock,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaBookOpen,
  FaBell,
  FaCog,
  FaEdit,
  FaDownload,
  FaShareAlt
} from 'react-icons/fa';
import { 
  MdAdminPanelSettings,
  MdOutlineVerified,
  MdDashboard,
  MdNotificationsNone
} from 'react-icons/md';

export default function AdminProfile() {
  const { data: profileData, isLoading, error } = getAdminProfileMutation();
  
  const adminData = profileData?.data;
  const schoolData = adminData?.school_id;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">
        <div className="bg-surface-card rounded-2xl shadow-xl p-8 max-w-md text-center border border-border">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Error Loading Profile</h3>
          <p className="text-text-secondary">Unable to fetch admin profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  const accountAge = Math.floor((new Date() - new Date(adminData?.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MdAdminPanelSettings className="text-primary text-2xl" />
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Administrator Portal
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-heading">Admin Profile</h1>
              <p className="text-text-secondary mt-2">Manage your profile and school information</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-surface-page rounded-xl transition-colors">
                <MdNotificationsNone className="w-6 h-6 text-text-secondary" />
              </button>
              <button className="p-2 hover:bg-surface-page rounded-xl transition-colors">
                <FaCog className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-surface-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <FaUserCircle className="w-28 h-28 text-primary" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-success rounded-full p-1.5 border-4 border-white shadow-md">
                    <MdOutlineVerified className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{adminData?.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <FaCheckCircle className="w-4 h-4 text-white/90" />
                  <span className="text-white/90 text-sm">Active Account</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <FaEnvelope className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-secondary">Email Address</p>
                    <p className="text-text-primary font-medium">{adminData?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <FaPhone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-secondary">Phone Number</p>
                    <p className="text-text-primary font-medium">{adminData?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <FaCalendarAlt className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-secondary">Member Since</p>
                    <p className="text-text-primary font-medium">
                      {new Date(adminData?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Account Age</span>
                    <span className="text-text-primary font-semibold">{accountAge} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-surface-card rounded-2xl border border-border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FaSchool className="text-primary" />
                    </div>
                    <span className="text-text-secondary">School Managed</span>
                  </div>
                  <span className="text-2xl font-bold text-text-primary">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-success" />
                    </div>
                    <span className="text-text-secondary">Account Status</span>
                  </div>
                  <span className="text-success font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                      <FaUserShield className="text-warning" />
                    </div>
                    <span className="text-text-secondary">User Role</span>
                  </div>
                  <span className="text-text-primary font-semibold">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* School Information */}
            <div className="bg-surface-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-primary text-xl" />
                  <h3 className="text-xl font-semibold text-text-primary">School Information</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">School Name</label>
                    <div className="bg-surface-page rounded-xl p-3">
                      <p className="text-text-primary font-medium">{schoolData?.name}</p>
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">School ID</label>
                    <div className="bg-surface-page rounded-xl p-3">
                      <p className="text-text-primary font-mono text-sm">{schoolData?._id}</p>
                    </div>
                  </div> */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Email Address</label>
                    <div className="bg-surface-page rounded-xl p-3">
                      <p className="text-text-primary">{schoolData?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Phone Number</label>
                    <div className="bg-surface-page rounded-xl p-3">
                      <p className="text-text-primary">{schoolData?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Permissions */}
            <div className="bg-surface-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaUserShield className="text-primary text-xl" />
                  <h3 className="text-xl font-semibold text-text-primary">Role & Permissions</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-surface-page rounded-xl">
                
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Access Level</p>
                    <p className="text-text-primary font-semibold">Full System Access</p>
                  </div>
                  <div className="h-8 w-px bg-border hidden md:block"></div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Permissions</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Read</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Write</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Delete</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Manage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-surface-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <FaRegClock className="text-primary text-xl" />
                  <h3 className="text-xl font-semibold text-text-primary">Recent Activity</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 hover:bg-surface-page rounded-xl transition-colors">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">Profile Created</p>
                      <p className="text-text-secondary text-sm">{new Date(adminData?.createdAt).toLocaleString()}</p>
                    </div>
                    <FaCheckCircle className="text-success" />
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-surface-page rounded-xl transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">School Association</p>
                      <p className="text-text-secondary text-sm">Linked with {schoolData?.name}</p>
                    </div>
                    <FaSchool className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-button-primary text-button-primary-text rounded-xl hover:bg-button-primary-hover transition-all duration-200 shadow-sm hover:shadow-md">
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 border border-border text-text-primary rounded-xl hover:bg-surface-page transition-all duration-200">
                <FaDownload className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 border border-border text-text-primary rounded-xl hover:bg-surface-page transition-all duration-200">
                <FaShareAlt className="w-4 h-4" />
                Share Profile
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}