import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import ExamForm from "./ExamForm";
import Button from "../../../components/common/Button";
import { createAcademicYearMutation, updateAcademicYearMutation, deleteSubscriptionMutation, updateSubscriptionStatusMutation, classesListMutation, createExamMutation, updateExamMutation } from "../../../hooks/useQueryMutations";
import { academicYearList } from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import ToggleButton from "../../../components/common/ToggleButton";
import { formatDate } from "../../../utils/commonFunction";
import Select from "../../../components/common/Select";
import DateRangePicker from "../../../components/common/DateRangePicker";
import { Eye } from "lucide-react";
import { MdEditNote } from "react-icons/md";





export default function Exams() {
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });
    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState("");
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const STATUS_MAP = {
        active: { label: "Active", bg: "bg-success/10", text: "text-success" },
        completed: { label: "Completed", bg: "bg-error/10", text: "text-error" },
        upcoming: { label: "Upcoming", bg: "bg-warning/10", text: "text-warning" },
    };


    const handleToggleStatus = async (row) => {
        try {
            const newStatus = row.status === "active" ? "inactive" : "active";


            await updateAcademicYear({
                id: row._id,
                data: { status: newStatus },
            });

            refetch();
        } catch (err) {
            console.error(err);
        }
    };
    const COLUMNS = [
        {
            key: "academicSession",
            label: "Session",
            sortable: true,
        },
        {
            key: "startDate",
            label: "Start Date",
            render: (val) =>
                val ? new Date(val).toLocaleDateString() : "—",
        },
        {
            key: "endDate",
            label: "End Date",
            render: (val) =>
                val ? new Date(val).toLocaleDateString() : "—",
        },
        {
            key: "status",
            label: "Status",
            render: (val, row) => {
                const status = STATUS_MAP[val] || {};

                return (
                    <div className="flex items-center gap-2">
                        <ToggleButton
                            disabled
                            isActive={val === "active"}
                            onToggle={() => handleToggleStatus(row)}
                        />

                        <span className={`text-xs font-medium px-2 py-1 rounded ${status.bg} ${status.text}`}>
                            {status.label}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "createdAt",
            label: "Created",
            render: (val) =>
                val ? new Date(val).toLocaleDateString() : "—",
        },
    ];
    const { data: classData } = classesListMutation({ page: 1, limit: 100 });
    const classOptions = classData?.results?.map((cls) => ({
        label: cls.name,
        value: cls._id,
    })) || [];
    console.log("classoptions", classOptions);
    const { mutateAsync: createExam, isPending } = createExamMutation();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            classId: [],   // ✅ MUST
        }
    });
    const { data: apiResponse, isLoading, refetch } = academicYearList();
    const { mutateAsync: updateExam, isPending: isupdating } = updateExamMutation();
    const { mutateAsync: deleteSubscription } = deleteSubscriptionMutation();
    const tableData = apiResponse?.results || [];
    const total = apiResponse?.results?.length ?? 0;

    // Load data
    //   const fetchData = async () => {
    //     const res = await getSubscriptions();
    //     setData(res.data);
    //   };

    //   useEffect(() => {
    //     fetchData();
    //   }, []);

    // Open modal
    const openModal = (type, item = null) => {
        setMode(type);
        setSelected(item);

        if (item) {
            reset({
                startDate: formatDate(item.startDate),
                endDate: formatDate(item.endDate),
                status: item.status,
                classId: item.classIds || [], // ✅ VERY IMPORTANT
            });
        } else {
            reset({
                startDate: "",
                endDate: "",
                status: "active", // default
                classId: [], // ✅ ADD THIS
            });
        }

        setIsOpen(true);
    };

    // Submit
    const onSubmit = async (formData) => {
        try {
            const createpayload = {
                name: formData.name,
                classId: formData.classId,
                startDate: formData.startDate,
                endDate: formData.endDate,


                //   status: formData.status,
            };
            const updatePayload = {
                name: formData.name,
                classId: formData.classId,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            if (mode === "create") {
                await createExam(createpayload);
            } else if (mode === "edit") {
                await updateExam({
                    id: selected._id,
                    data: updatePayload,
                });
            }

            refetch();
            setIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Delete
    const handleDelete = async () => {
        await deleteSubscription(selected._id);
        refetch();
        setIsOpen(false);
    };

    return (
        <div className="p-6">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Exams</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all exams on EduCore.
                    </p>
                </div>
                <div className="flex justify-end items-center gap-3">
                    <div>
                        <DateRangePicker value={dateRange} onChange={setDateRange} />
                    </div>
                    <div>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            options={classOptions}
                            placeholder="Filter by Class"
                            className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-emerald-500 transition-all duration-200"
                        />
                    </div>
                    <div className="relative">
                        <Button onClick={() => openModal("create")} >
                            Add Exam
                        </Button>
                    </div>
                </div>
            </div>
            {/* Add Button */}


            {/* List */}
            <div className="grid gap-3 mt-6 ">
                {/* {data.map((item) => (
                    <div key={item._id} className="border p-4 rounded-md flex justify-between">
                        <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p>₹ {item.price}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => openModal("view", item)}>View</button>
                            <button onClick={() => openModal("edit", item)}>Edit</button>
                            <button onClick={() => openModal("delete", item)}>Delete</button>
                        </div>
                    </div>
                ))} */}

                <DataTable
                    title="All Exams"
                    data={tableData}
                    columns={COLUMNS}
                    loading={isLoading}
                    rowKey="_id"
                    serverMode
                    onAdd={() => openModal("create")}
                    addLabel="Add exam"
                    onSearch={(val) => { setSearch(val); setPage(1); }}

                    // onEdit={(row) => openModal("edit", row)}
                    actionCell={(row) => (
                        <div className="flex items-center gap-1">

                            {/* View Subjects */}
                            <button className="cursor-pointer"
                                onClick={() => navigate(`/school-admin/classes/${row._id}/subjects`)}
                                title="View Subjects"
                            >
                                <Eye size={16} />
                            </button>
                            <button className="cursor-pointer text-primary"
                                onClick={() => openModal("edit", row)}
                                title="Edit Subjects"
                            >
                                <MdEditNote size={20} />
                            </button>

                            {/* Add Subjects */}


                        </div>
                    )}
                    // onDelete={(row) => {
                    //     setSelected(row);
                    //     setConfirmOpen(true);
                    // }}


                    searchPlaceholder="Search exams..."
                />
            </div>

            {/* Modal */}
            <SidePanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title={`${mode.toUpperCase()} Exam`}

            >

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <ExamForm
                        register={register}
                        errors={errors}
                        mode={mode}
                        control={control}
                        classoptions={classOptions}
                    />

                    <div className="flex justify-end mt-auto">
                        {mode !== "view" && (
                            <Button type="submit" loading={mode == "edit" ? isupdating : isPending} loadingLabel={mode === "edit" ? "Updating..." : "Creating..."} variant="primary">
                                {mode === "edit" ? "Update" : "Create"}
                            </Button>
                        )}
                    </div>
                </form>

            </SidePanel>
            <ConfirmBox
                isOpen={confirmOpen}
                title="Delete Academic Session"
                message={`Are you sure you want to delete "${selected?.academicSession}"?`}
                loading={isPending}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    try {
                        await deleteSubscription(selected._id);
                        refetch();
                        setConfirmOpen(false);
                    } catch (err) {
                        console.error(err);
                    }
                }}
            />
        </div>
    );
}