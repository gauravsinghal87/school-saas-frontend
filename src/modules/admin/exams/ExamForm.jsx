import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";

export default function ExamForm({
    register,
    errors,
    mode = "create",
    control,
    classOptions = []
}) {
    const isView = mode === "view";

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Exam Name"
                id="name"
                type="text"
                placeholder="Enter exam name"
                register={register("name", { required: "Exam name is required" })}
                error={errors.name?.message}
                required
                disabled={isView}
            />

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

            <Input
                label="Start Date"
                id="startDate"
                type="date"
                register={register("startDate", { required: "Start date is required" })}
                error={errors.startDate?.message}
                required
                disabled={isView}
            />

            <Input
                label="End Date"
                id="endDate"
                type="date"
                register={register("endDate", {
                    required: "End date is required",
                    validate: (value, formValues) => {
                        if (formValues.startDate && value < formValues.startDate) {
                            return "End date must be after start date";
                        }
                        return true;
                    }
                })}
                error={errors.endDate?.message}
                required
                disabled={isView}
            />

            {mode === "edit" && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value || "draft"}
                                onChange={(val) => field.onChange(val)}
                                options={[
                                    { label: "Draft", value: "draft" },
                                    { label: "Published", value: "published" },
                                    { label: "Completed", value: "completed" },
                                ]}
                                placeholder="Select status"
                                error={errors.status?.message}
                                disabled={isView}
                            />
                        )}
                    />
                </div>
            )}
        </div>
    );
}