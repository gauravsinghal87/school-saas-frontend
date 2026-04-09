import { useState } from "react";
import { useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import FeeForm from "./FeesForm";
import Button from "../../../components/common/Button";
import {
    createFeeStructureMutation,
    updateFeeStructureMutation,
    deleteFeeStructureMutation,
    feeStructuresList
} from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";

export default function Fees() {
    const [isOpen, setIsOpen] = useState(false);
    const [limit, setLimit] = useState(10);
    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Columns definition for DataTable
    const COLUMNS = [
        {
            key: "classId",
            label: "Class",
            sortable: true,
            render: (val) => {
                if (!val) return "—";
                if (typeof val === 'object') return val.name || "—";
                return val || "—";
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
            key: "feeHeads",
            label: "Fee Heads",
            render: (val) => {
                if (!val || val.length === 0) return "—";
                return (
                    <div className="flex gap-1 flex-wrap">
                        {val.map((head, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-xs "
                            >
                                {head.type}: ₹{head.amount?.toLocaleString()}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: "totalAmount",
            label: "Total Amount",
            render: (val) => `₹${val?.toLocaleString() || 0}`,
        },
        {
            key: "createdAt",
            label: "Created",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    // Mutations
    const { mutateAsync: createFee, isPending: isCreating } = createFeeStructureMutation();
    const { mutateAsync: updateFee, isPending: isUpdating } = updateFeeStructureMutation();
    const { mutateAsync: deleteFee, isPending: isDeleting } = deleteFeeStructureMutation();

    // Fetch data
    const { data: apiResponse, isLoading, refetch } = feeStructuresList({ page, limit, search });

    const tableData = apiResponse?.results || [];
    const total = apiResponse?.pagination?.totalItems ?? 0;

    // Form handling
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            classId: "",
            academicSessionId: "",
            feeHeads: [],
            totalAmount: 0,
            status: "active",
        },
    });

    // Watch feeHeads to calculate total
    const watchedFeeHeads = watch("feeHeads");

    // Calculate total amount whenever fee heads change
    useState(() => {
        if (watchedFeeHeads && watchedFeeHeads.length > 0) {
            const total = watchedFeeHeads.reduce((sum, head) => {
                return sum + (parseFloat(head?.amount) || 0);
            }, 0);
            setValue("totalAmount", total);
        } else if (watchedFeeHeads && watchedFeeHeads.length === 0) {
            setValue("totalAmount", 0);
        }
    }, [watchedFeeHeads, setValue]);

    // Open modal
    const openModal = (type, item = null) => {
        setMode(type);
        setSelected(item);

        if (type === "edit" && item) {
            reset({
                classId: item.classId?._id || item.classId || "",
                academicSessionId: item.academicSessionId?._id || item.academicSessionId || "",
                feeHeads: item.feeHeads || [],
                totalAmount: item.totalAmount || 0,
                status: item.status || "active",
            });
        } else {
            reset({
                classId: "",
                academicSessionId: "",
                feeHeads: [],
                totalAmount: 0,
                status: "active",
            });
        }

        setIsOpen(true);
    };

    // Submit form
    const onSubmit = async (formData) => {
        try {
            const payload = {
                classId: formData.classId,
                feeHeads: formData.feeHeads.map(head => ({
                    type: head.type,
                    amount: parseFloat(head.amount),
                    isOptional: head.isOptional || false
                })),
                totalAmount: parseFloat(formData.totalAmount),
                status: "active",
            };

            // Only add academicSessionId if it has a value
            if (formData.academicSessionId && formData.academicSessionId !== "") {
                payload.academicSessionId = formData.academicSessionId;
            }

            if (mode === "create") {
                await createFee(payload);
            } else {
                await updateFee({
                    id: selected._id,
                    data: payload,
                });
            }

            refetch();
            setIsOpen(false);
            reset();
        } catch (err) {
            console.error("Error saving fee structure:", err);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        try {
            await deleteFee(selected._id);
            refetch();
            setConfirmOpen(false);
        } catch (err) {
            console.error("Error deleting fee structure:", err);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Fee Management</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage fee structures for different classes and academic sessions.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => openModal("create")}>
                        Add Fee Structure
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="grid gap-3 mt-6">
                <DataTable
                    title="Fee Structures"
                    data={tableData}
                    columns={COLUMNS}
                    loading={isLoading}
                    rowKey="_id"
                    serverMode
                    onAdd={() => openModal("create")}
                    addLabel="Add Fee Structure"
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onEdit={(row) => openModal("edit", row)}
                    onDelete={(row) => {
                        setSelected(row);
                        setConfirmOpen(true);
                    }}
                    searchPlaceholder="Search by class or session..."
                />
            </div>

            {/* Side Panel Form */}
            <SidePanel
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    reset();
                }}
                title={`${mode === "create" ? "Create" : "Edit"} Fee Structure`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FeeForm
                        register={register}
                        errors={errors}
                        mode={mode}
                        control={control}
                        setValue={setValue}
                        watch={watch}
                    />

                    <div className="flex justify-end mt-auto">
                        {mode !== "view" && (
                            <Button
                                type="submit"
                                loading={mode === "edit" ? isUpdating : isCreating}
                                loadingLabel={mode === "edit" ? "Updating..." : "Creating..."}
                                variant="primary"
                            >
                                {mode === "edit" ? "Update" : "Create"}
                            </Button>
                        )}
                    </div>
                </form>
            </SidePanel>

            {/* Confirm Delete Dialog */}
            <ConfirmBox
                isOpen={confirmOpen}
                title="Delete Fee Structure"
                message={`Are you sure you want to delete this fee structure?`}
                loading={isDeleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}