import { useState, useEffect } from "react";
import DataTable from "../../../components/common/ReusableTable";
import Button from "../../../components/common/Button";
import { getStaffList, generateStaffSalaryMutation } from "../../../hooks/useQueryMutations";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import SlidePanel from "../../../components/common/SlidePanel";
import PayrollForm from "./PayrollForm";
import { useForm } from "react-hook-form";


export default function PayRollList() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();

    const [search, setSearch] = useState(""); 
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const { data, isLoading, refetch } = getStaffList({
        page,
        limit,
        searchTerm:search,
        statusFilter:status,
    });

    const staffData = data?.data;
    useEffect(() => {
        refetch();
    }, [page, search, role, status]);


    const total = data?.pagination?.total || 0;


    const COLUMNS = [
        {
            key: "name",
            label: "Name",
            render: (_, row) => row?.user_id?.name || "-",
        },
        {
            key: "email",
            label: "Email",
            render: (_, row) => row?.user_id?.email || "-",
        },
        {
            key: "phone",
            label: "Phone",
            render: (_, row) => row?.contact?.phone || "-",
        },
        {
            key: "department",
            label: "Department",
        },
        {
            key: "designation",
            label: "Designation",
        },
        {
            key: "experience",
            label: "Experience",
            render: (val) => `${val || 0} yrs`,
        },
        {
            key: "salary",
            label: "Salary",
            render: (val) => `₹${val || 0}`,
        },
        {
            key: "role",
            label: "Role",
            render: (_, row) => (
                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                    {row?.roleId?.name || "-"}
                </span>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (val) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${val === "active"
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                        }`}
                >
                    {val}
                </span>
            ),
        },
    ];
    const handleViewAttendance = (row) => {
        navigate(`/school-admin/payroll/${row._id}`);
    };
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            month: "",
            year: "",
            staffId: ""
        },
    });
    const { mutateAsync: generateStaffSalary, isPending } = generateStaffSalaryMutation();

    const onSubmit = async (formData) => {
        try {
            generateStaffSalary({
                staffId: formData.staffId,
                month: formData.month,
                year: formData.year,
            });
        } catch (err) {
            console.error(err);
        }
        finally {
            setIsPanelOpen(false);
            reset({
                month: "",
                year: "",
                staffId: ""
            });
            refetch();
        }
    };

    return (
        <div className="md:p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">
                        PayRoll Management
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Manage and track payroll details of staff members
                    </p>
                </div>
            </div>

            {/* 🔥 FILTER BAR (Compact + Clean) */}
            <div className="bg-surface-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">

                {/* Role Filter */}
                {/* <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 border border-border rounded-lg bg-surface text-sm"
                >
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>

                </select> */}

                {/* Status Filter */}
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 border border-border rounded-lg bg-surface text-sm"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {/* Clear Filters */}
                <button className="border border-gray-200 py-2 py-[5px] rounded px-2 cursor-pointer"
                    variant="outline"
                    onClick={() => {
                        setRole("");
                        setStatus("");
                        setSearch("");
                        setPage(1);
                    }}
                >
                    <span className='text-text-heading'> Clear Filters</span>
                </button>
            </div>

            {/* 📊 TABLE */}
            <div className="md:w-[75vw] w-[93vw]">
                <DataTable
                    title="Staff PayRoll List"
                    data={staffData}
                    columns={COLUMNS}
                    loading={isLoading}
                    rowKey="_id"
                    serverMode

                    // ✅ CORRECT PAGINATION
                    page={page}
                    total={total}

                    onPageChange={(newPage) => setPage(newPage)}

                    actionCell={(row) => (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleViewAttendance(row)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition"
                            >
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    reset({
                                        month: "",
                                        year: "",
                                        staffId: row._id, // ✅ set staffId here
                                    });
                                    setIsPanelOpen(true);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition"
                            >
                                <IoAdd size={16} />
                            </button>
                        </div>
                    )}

                    onSearch={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}

                    searchPlaceholder="Search by name or email..."
                />
            </div>
            <SlidePanel open={isPanelOpen} onClose={() => setIsPanelOpen(false)} title="Add Payroll">
                <form onSubmit={handleSubmit(onSubmit)
                }>
                    <PayrollForm register={register} errors={errors} control={control} />
                    <div className="mt-3">
                        <Button type="submit" className="mt-4">
                            <span className='text-text-heading'> Save</span>
                        </Button>
                    </div>
                </form>

            </SlidePanel>
        </div>
    );
}