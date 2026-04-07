import { useEffect, useCallback } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import { classesListMutation } from "../../../hooks/useQueryMutations";
import { academicYearList } from "../../../hooks/useQueryMutations";
import { Plus, Trash2 } from "lucide-react";

export default function FeeForm({
    register,
    errors,
    mode = "create",
    control,
    setValue,
    watch
}) {
    const isView = mode === "view";

    // Fetch classes
    const { data: classesData } = classesListMutation({ page: 1, limit: 100, search: "" });
    const classOptions = classesData?.results?.map((cls) => ({
        label: cls.name,
        value: cls._id,
    })) || [];

    // Fetch academic sessions
    const { data: academicSessions } = academicYearList({ page: 1, limit: 100, search: "" });
    const academicSessionOptions = academicSessions?.results?.map((session) => ({
        label: session.academicSession || `${new Date(session.startDate).getFullYear()}-${new Date(session.endDate).getFullYear()}`,
        value: session._id,
    })) || [];

    // Dynamic fee heads array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "feeHeads",
    });

    // Function to calculate total
    const calculateTotal = useCallback(() => {
        const feeHeads = watch("feeHeads") || [];
        const total = feeHeads.reduce((sum, head) => {
            const amount = parseFloat(head?.amount) || 0;
            return sum + amount;
        }, 0);
        setValue("totalAmount", total);
    }, [watch, setValue]);

    // Calculate total whenever feeHeads change
    useEffect(() => {
        calculateTotal();
    }, [fields, calculateTotal]);

    // Listen to amount changes in real-time
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name && (name.includes('feeHeads') && name.includes('amount'))) {
                calculateTotal();
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, calculateTotal]);

    const feeTypeOptions = [
        { label: "School Fee", value: "School Fee" },
        { label: "Transport Fee", value: "Transport Fee" },
        { label: "Library Fee", value: "Library Fee" },
        { label: "Sports Fee", value: "Sports Fee" },
        { label: "Exam Fee", value: "Exam Fee" },
        { label: "Lab Fee", value: "Lab Fee" },
        { label: "Development Fee", value: "Development Fee" },
        { label: "Other", value: "Other" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Class Selection */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                    Class <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="classId"
                    control={control}
                    rules={{ required: "Class is required" }}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onChange={(val) => field.onChange(val)}
                            options={classOptions}
                            placeholder="Select class"
                            error={errors.classId?.message}
                            disabled={isView}
                        />
                    )}
                />
            </div>

            {/* Academic Session Selection (Optional) */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                    Academic Session (Optional)
                </label>
                <Controller
                    name="academicSessionId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onChange={(val) => field.onChange(val)}
                            options={academicSessionOptions}
                            placeholder="Select academic session (optional)"
                            error={errors.academicSessionId?.message}
                            disabled={isView}
                        />
                    )}
                />
            </div>

            {/* Dynamic Fee Heads */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold">
                        Fee Heads <span className="text-red-500">*</span>
                    </label>
                    {!isView && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => append({ type: "", amount: "", isOptional: false })}
                            className="flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            Add Fee Head
                        </Button>
                    )}
                </div>

                {fields.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm border border-dashed rounded-lg">
                        No fee heads added. Click "Add Fee Head" to continue.
                    </div>
                )}

                {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-3 bg-gray-50 ">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Fee Head {index + 1}</span>
                            {!isView && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Fee Type */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium">Fee Type</label>
                                <Controller
                                    name={`feeHeads.${index}.type`}
                                    control={control}
                                    rules={{ required: "Fee type is required" }}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || ""}
                                            onChange={(val) => {
                                                field.onChange(val);
                                                calculateTotal();
                                            }}
                                            options={feeTypeOptions}
                                            placeholder="Select fee type"
                                            error={errors.feeHeads?.[index]?.type?.message}
                                            disabled={isView}
                                        />
                                    )}
                                />
                            </div>

                            {/* Amount */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium">Amount (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    register={register(`feeHeads.${index}.amount`, {
                                        required: "Amount is required",
                                        min: { value: 1, message: "Amount must be greater than 0" },
                                        valueAsNumber: true,
                                        onChange: () => {
                                            setTimeout(calculateTotal, 50);
                                        }
                                    })}
                                    error={errors.feeHeads?.[index]?.amount?.message}
                                    disabled={isView}
                                />
                            </div>
                        </div>

                        {/* Is Optional */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`optional-${index}`}
                                {...register(`feeHeads.${index}.isOptional`)}
                                disabled={isView}
                                className="w-4 h-4"
                            />
                            <label htmlFor={`optional-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
                                Optional fee (can be waived off)
                            </label>
                        </div>
                    </div>
                ))}

                {errors.feeHeads?.message && (
                    <p className="text-sm text-red-500">{errors.feeHeads.message}</p>
                )}
            </div>

            {/* Total Amount (Auto-calculated) */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Total Amount (₹)</label>
                <Input
                    type="number"
                    placeholder="Total amount"
                    register={register("totalAmount")}
                    error={errors.totalAmount?.message}
                    disabled={true}
                    className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Auto-calculated from fee heads</p>
            </div>

            {/* Hidden status field */}
            <input type="hidden" {...register("status")} defaultValue="active" />
        </div>
    );
}