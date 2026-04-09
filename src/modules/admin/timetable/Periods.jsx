import { useState } from "react";
import { useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import PeriodForm from "./PeriodForm";
import Button from "../../../components/common/Button";
import {
    createPeriodMutation,
    updatePeriodMutation,
    deletePeriodMutation,
    periodsList
} from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import { academicYearList } from "../../../hooks/useQueryMutations";

export default function Periods() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

    // Fetch academic sessions for filtering
    const { data: academicSessions } = academicYearList({ page: 1, limit: 100, search: "" });
    const academicYearOptions = academicSessions?.results || [];

    // Columns definition
    const COLUMNS = [
        {
            key: "order",
            label: "Order",
            sortable: true,
            render: (val) => val || "—",
        },
        {
            key: "name",
            label: "Period Name",
            sortable: true,
        },
        {
            key: "startTime",
            label: "Start Time",
            render: (val) => val || "—",
        },
        {
            key: "endTime",
            label: "End Time",
            render: (val) => val || "—",
        },
        {
            key: "duration",
            label: "Duration",
            render: (val, row) => {
                if (row.startTime && row.endTime) {
                    return `${row.startTime} - ${row.endTime}`;
                }
                return "—";
            },
        },
        {
            key: "academicSessionId",
            label: "Academic Session",
            render: (val) => {
                if (!val) return "—";
                if (typeof val === 'object') {
                    if (val.academicSession) return val.academicSession;
                    if (val.startDate && val.endDate) {
                        return `${new Date(val.startDate).getFullYear()}-${new Date(val.endDate).getFullYear()}`;
                    }
                }
                return "—";
            },
        },
        {
            key: "createdAt",
            label: "Created",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    // Mutations
    const { mutateAsync: createPeriod, isPending: isCreating } = createPeriodMutation();
    const { mutateAsync: updatePeriod, isPending: isUpdating } = updatePeriodMutation();
    const { mutateAsync: deletePeriod, isPending: isDeleting } = deletePeriodMutation();

    // Fetch periods
    const params = {
        page,
        limit,
        search,
        academicSessionId: selectedAcademicYear || undefined,
    };
    const { data: apiResponse, isLoading, refetch } = periodsList(params);
    const tableData = apiResponse?.data || apiResponse?.results || [];

    // Form handling
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            academicSessionId: "",
            name: "",
            startTime: "",
            endTime: "",
            order: "",
        },
    });

    const openModal = (type, item = null) => {
        setMode(type);
        setSelected(item);

        if (type === "edit" && item) {
            reset({
                academicSessionId: item.academicSessionId?._id || item.academicSessionId || "",
                name: item.name || "",
                startTime: item.startTime || "",
                endTime: item.endTime || "",
                order: item.order || "",
            });
        } else {
            reset({
                academicSessionId: selectedAcademicYear || "",
                name: "",
                startTime: "",
                endTime: "",
                order: "",
            });
        }

        setIsOpen(true);
    };

    const onSubmit = async (formData) => {
        try {
            const payload = {
                academicSessionId: formData.academicSessionId,
                name: formData.name,
                startTime: formData.startTime,
                endTime: formData.endTime,
                order: parseInt(formData.order),
            };

            if (mode === "create") {
                await createPeriod(payload);
            } else {
                await updatePeriod({
                    id: selected._id,
                    data: payload,
                });
            }

            refetch();
            setIsOpen(false);
            reset();
        } catch (err) {
            console.error("Error saving period:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePeriod(selected._id);
            refetch();
            setConfirmOpen(false);
        } catch (err) {
            console.error("Error deleting period:", err);
        }
    };

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex gap-4">
                <div className="w-64">
                    <select
                        className="w-full px-3 py-2 border border-border  text-text-heading  rounded-lg "
                        value={selectedAcademicYear}
                        onChange={(e) => {
                            setSelectedAcademicYear(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Academic Sessions</option>
                        {academicYearOptions.map((session) => (
                            <option key={session._id} value={session._id}>
                                {session.academicSession || `${new Date(session.startDate).getFullYear()}-${new Date(session.endDate).getFullYear()}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Header with Add Button */}
            <div className="flex justify-end mb-4">
                <Button onClick={() => openModal("create")}>
                    Add Period
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                title="Periods"
                data={tableData}
                columns={COLUMNS}
                loading={isLoading}
                rowKey="_id"
                serverMode
                onSearch={(val) => { setSearch(val); setPage(1); }}
                onEdit={(row) => openModal("edit", row)}
                onDelete={(row) => {
                    setSelected(row);
                    setConfirmOpen(true);
                }}
                searchPlaceholder="Search periods..."
            />

            {/* Side Panel Form */}
            <SidePanel
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    reset();
                }}
                title={`${mode === "create" ? "Create" : "Edit"} Period`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <PeriodForm
                        register={register}
                        errors={errors}
                        mode={mode}
                        control={control}
                        selectedAcademicYear={selectedAcademicYear}
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
                title="Delete Period"
                message={`Are you sure you want to delete "${selected?.name}"?`}
                loading={isDeleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}