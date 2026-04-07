import { useState } from "react";
import { useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import ExamForm from "./ExamForm";
import Button from "../../../components/common/Button";
import { createExamMutation, updateExamMutation, deleteExamMutation, examsList } from "../../../hooks/useQueryMutations";
import { classesListMutation } from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import { Eye, Edit, Trash2, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_MAP = {
    draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-600" },
    published: { label: "Published", bg: "bg-green-100", text: "text-green-600" },
    completed: { label: "Completed", bg: "bg-blue-100", text: "text-blue-600" },
};

export default function Exams() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Columns definition
    const COLUMNS = [
        {
            key: "name",
            label: "Exam Name",
            sortable: true,
        },
        {
            key: "classId",
            label: "Class",
            render: (val) => val?.name || "—",
        },
        {
            key: "startDate",
            label: "Start Date",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
        {
            key: "endDate",
            label: "End Date",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
        {
            key: "status",
            label: "Status",
            render: (val) => {
                const status = STATUS_MAP[val] || { label: val, bg: "bg-gray-100", text: "text-gray-600" };
                return (
                    <span className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                    </span>
                );
            },
        },
        {
            key: "createdAt",
            label: "Created",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    // Fetch classes for filter
    const { data: classData } = classesListMutation({ page: 1, limit: 100 });
    const classOptions = classData?.results?.map((cls) => ({
        label: cls.name,
        value: cls._id,
    })) || [];

    const statusOptions = [
        { label: "All", value: "" },
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Completed", value: "completed" },
    ];

    // Mutations
    const { mutateAsync: createExam, isPending: isCreating } = createExamMutation();
    const { mutateAsync: updateExam, isPending: isUpdating } = updateExamMutation();
    const { mutateAsync: deleteExam, isPending: isDeleting } = deleteExamMutation();

    // Fetch exams
    const params = {
        page,
        limit,
        search,
        classId: selectedClass || undefined,
        status: selectedStatus || undefined,
    };
    const { data: apiResponse, isLoading, refetch } = examsList(params);
    const tableData = apiResponse?.data?.results || apiResponse?.results || [];
    const pagination = apiResponse?.data?.pagination || apiResponse?.pagination || {};

    // Form handling
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            classId: "",
            startDate: "",
            endDate: "",
            status: "draft",
        },
    });

    const openModal = (type, item = null) => {
        setMode(type);
        setSelected(item);

        if (type === "edit" && item) {
            reset({
                name: item.name || "",
                classId: item.classId?._id || item.classId || "",
                startDate: item.startDate ? item.startDate.split("T")[0] : "",
                endDate: item.endDate ? item.endDate.split("T")[0] : "",
                status: item.status || "draft",
            });
        } else {
            reset({
                name: "",
                classId: "",
                startDate: "",
                endDate: "",
                status: "draft",
            });
        }

        setIsOpen(true);
    };

    const onSubmit = async (formData) => {
        try {
            const payload = {
                name: formData.name,
                classId: formData.classId,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            if (mode === "create") {
                await createExam(payload);
            } else if (mode === "edit") {
                await updateExam({
                    id: selected._id,
                    data: payload,
                });
            }

            refetch();
            setIsOpen(false);
            reset();
        } catch (err) {
            console.error("Error saving exam:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteExam(selected._id);
            refetch();
            setConfirmOpen(false);
        } catch (err) {
            console.error("Error deleting exam:", err);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Exam Management</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage exams, subjects, marks, and results
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => openModal("create")}>
                        Add Exam
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <div className="w-48">
                    <select
                        className="w-full px-3 py-2 border rounded-lg "
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">All Classes</option>
                        {classOptions.map((cls) => (
                            <option key={cls.value} value={cls.value}>
                                {cls.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-40">
                    <select
                        className="w-full px-3 py-2 border rounded-lg "
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                title="All Exams"
                data={tableData}
                columns={COLUMNS}
                loading={isLoading}
                rowKey="_id"
                serverMode
                onSearch={(val) => { setSearch(val); setPage(1); }}
                searchPlaceholder="Search exams..."
                actionCell={(row) => (
                    <div className="flex items-center gap-2">
                        <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => navigate(`/school-admin/exams/${row._id}/subjects`)}
                            title="Manage Subjects"
                        >
                            <BookOpen size={18} />
                        </button>
                        {/* <button
                            className="text-green-600 hover:text-green-800"
                            onClick={() => navigate(`/school-admin/exams/${row._id}/marks`)}
                            title="Manage Marks"
                        >
                            <FileText size={18} />
                        </button>
                        <button
                            className="text-purple-600 hover:text-purple-800"
                            onClick={() => navigate(`/school-admin/exams/${row._id}/results`)}
                            title="View Results"
                        >
                            <Eye size={18} />
                        </button> */}
                        <button
                            className="text-yellow-600 hover:text-yellow-800"
                            onClick={() => openModal("edit", row)}
                            title="Edit Exam"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                                setSelected(row);
                                setConfirmOpen(true);
                            }}
                            title="Delete Exam"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            />

            {/* Side Panel Form */}
            <SidePanel
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    reset();
                }}
                title={`${mode === "create" ? "Create" : "Edit"} Exam`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <ExamForm
                        register={register}
                        errors={errors}
                        mode={mode}
                        control={control}
                        classOptions={classOptions}
                    />

                    <div className="flex justify-end mt-auto">
                        <Button
                            type="submit"
                            loading={mode === "edit" ? isUpdating : isCreating}
                            loadingLabel={mode === "edit" ? "Updating..." : "Creating..."}
                            variant="primary"
                        >
                            {mode === "edit" ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </SidePanel>

            {/* Confirm Delete Dialog */}
            <ConfirmBox
                isOpen={confirmOpen}
                title="Delete Exam"
                message={`Are you sure you want to delete "${selected?.name}"?`}
                loading={isDeleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}