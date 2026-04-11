// FeesReport.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../components/common/ReusableTable";
import Button from "../../../../components/common/Button";
import { Eye } from "lucide-react";
import { classesListMutation, sectionList, getPaymentHistory } from "../../../../hooks/useQueryMutations";

export default function FeesReport() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [sectionOptions, setSectionOptions] = useState([]);

    // Fetch classes from API
    const { data: classData } = classesListMutation({ page: 1, limit: 100 });
    const classOptions = classData?.results?.map((cls) => ({
        label: cls.name,
        value: cls._id,
        className: cls.name
    })) || [];

    // Get selected class name for API
    const getSelectedClassName = () => {
        const selectedClassObj = classOptions.find(c => c.value === selectedClass);
        return selectedClassObj?.className || "";
    };

    // Get selected section name for API
    const getSelectedSectionName = () => {
        const selectedSectionObj = sectionOptions.find(s => s.value === selectedSection);
        return selectedSectionObj?.label || "";
    };

    // Fetch students list from API with backend filters
    const {
        data: studentsResponse,
        isLoading: isLoadingStudents,
        refetch: refetchStudents
    } = getPaymentHistory({
        page: page,
        limit: limit,
        search: search,
        className: selectedClass ? getSelectedClassName() : "",
        section: selectedSection ? getSelectedSectionName() : ""
    });

    // Fetch sections based on selected class
    const { data: sectionsData, refetch: refetchSections } = sectionList({
        page: 1,
        limit: 100,
        search: "",
        classId: selectedClass,
    });

    // Update section options when sectionsData changes
    useEffect(() => {
        if (sectionsData?.results?.docs && selectedClass) {
            const sections = sectionsData.results.docs.map((section) => ({
                label: section.name,
                value: section._id,
                className: section.name,
                classId: section.classId
            }));
            setSectionOptions(sections);
        } else {
            setSectionOptions([]);
        }
    }, [sectionsData, selectedClass]);

    // Refetch sections when class changes
    useEffect(() => {
        if (selectedClass) {
            refetchSections();
            setSelectedSection(""); // Reset section when class changes
        } else {
            setSectionOptions([]);
            setSelectedSection("");
        }
    }, [selectedClass, refetchSections]);

    // Refetch students when filters change
    useEffect(() => {
        setPage(1); // Reset to first page when filters change
        refetchStudents();
    }, [selectedClass, selectedSection, search, refetchStudents]);

    // Refetch when page changes
    useEffect(() => {
        refetchStudents();
    }, [page, refetchStudents]);

    // Process students data from API response - NO FRONTEND FILTERING
    const studentsData = studentsResponse?.result || [];
    const totalRecords = studentsResponse?.result?.length || 0;

    const COLUMNS = [
        {
            key: "rollNumber",
            label: "Roll Number",
            sortable: true,
            render: (val, row) => row.rollNumber || "—"
        },
        {
            key: "studentName",
            label: "Student Name",
            sortable: true,
            render: (val, row) => {
                if (row.studentId && row.studentId.firstName) {
                    return `${row.studentId.firstName} ${row.studentId.lastName || ''}`.trim();
                }
                return "N/A";
            }
        },
        {
            key: "class",
            label: "Class",
            sortable: true,
            render: (val, row) => {
                const className = row.classId?.name || 'N/A';
                const sectionName = row.sectionId?.name || 'N/A';
                return `${className}${getClassSuffix(className)} - ${sectionName}`;
            }
        },
        {
            key: "result",
            label: "Status",
            render: (val, row) => getStatusBadge(row.result)
        }
    ];

    // Helper function to add suffix to class numbers
    const getClassSuffix = (className) => {
        const num = parseInt(className);
        if (isNaN(num)) return "";

        if (num === 1) return "st";
        if (num === 2) return "nd";
        if (num === 3) return "rd";
        return "th";
    };

    // Status color mapping
    const getStatusBadge = (status) => {
        const statusMap = {
            active: { label: "Active", className: "bg-success/10 text-success" },
            inactive: { label: "Inactive", className: "bg-error/10 text-error" }
        };

        const statusInfo = statusMap[status] || statusMap.inactive;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleViewFees = (row) => {
        const studentName = row.studentId?.firstName
            ? `${row.studentId.firstName} ${row.studentId.lastName || ''}`.trim()
            : "N/A";

        navigate(`/school-admin/fees/${row._id}/details`, {
            state: {
                studentId: row._id,
                studentData: {
                    _id: row._id,
                    studentName: studentName,
                    rollNumber: row.rollNumber,
                    className: row.classId?.name || 'N/A',
                    section: row.sectionId?.name || 'N/A'
                }
            }
        });
    };

    const handleClearFilters = () => {
        setSelectedClass("");
        setSelectedSection("");
        setSearch("");
        setPage(1);
    };

    return (
        <div className="md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Fees Report</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage and track student fee records
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-surface-card rounded-xl border border-border p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-medium text-text-heading mb-1">
                            Class
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSection("");
                            }}
                        >
                            <option value="">All Classes</option>
                            {classOptions.map((cls) => (
                                <option key={cls.value} value={cls.value}>
                                    {cls.label}{getClassSuffix(cls.label)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section Filter */}
                    <div>
                        <label className="block text-sm font-medium text-text-heading mb-1">
                            Section
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            disabled={!selectedClass || sectionOptions.length === 0}
                        >
                            <option value="">All Sections</option>
                            {sectionOptions.map((sec) => (
                                <option key={sec.value} value={sec.value}>
                                    Section {sec.label}
                                </option>
                            ))}
                        </select>
                        {selectedClass && sectionOptions.length === 0 && (
                            <p className="text-xs text-error mt-1">No sections found for this class</p>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            onClick={handleClearFilters}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-[93vw] md:w-auto">
                    <DataTable
                        title="Student Fees List"
                        data={studentsData}
                        columns={COLUMNS}
                        loading={isLoadingStudents}
                        rowKey="_id"
                        serverMode={true}
                        pagination={{
                            currentPage: page,
                            totalPages: Math.ceil(totalRecords / limit),
                            totalItems: totalRecords,
                            limit: limit
                        }}
                        onPageChange={(newPage) => setPage(newPage)}
                        onSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        actionCell={(row) => (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleViewFees(row)}
                                    title="View Fees Details"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>
                        )}
                        searchPlaceholder="Search by student name, roll number..."
                    />
                </div>
            </div>
        </div>
    );
}