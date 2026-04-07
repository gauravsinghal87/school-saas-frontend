// ExamForm.jsx - FIXED VERSION
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";

export default function ExamForm({
    register,
    errors,
    mode = "create",
    control,
    classoptions
}) {
    const isView = mode === "view";

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Exam Name"
                id="exam_name"
                type="text"
                placeholder="Exam Name"
                register={register("name", { required: "Exam name is required" })}
                error={errors.name?.message}
                required
                disabled={isView}
            />

            <Controller 
                name="classId"
                control={control}
                rules={{ required: "Class is required" }}
                render={({ field }) => {
                    console.log("Field value:", field.value); // Debug log
                    console.log("Class options:", classoptions); // Debug log
                    
                    return (
                        <Select
                            // isMulti
                            name="classId"
                            label="Class"
                            placeholder="Select class"
                            options={classoptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.classId?.message}
                            disabled={isView}
                        />
                    );
                }}
            />

            <Input
                label="Start Date"
                id="start_date"
                type="date"
                placeholder="Start Date"
                register={register("startDate", { required: "Start date is required" })}
                error={errors.startDate?.message}
                required
                disabled={isView}
            />
                <Input
                label="End Date"
                id="end_date"
                type="date"
                placeholder="End Date"
                register={register("endDate", { required: "End date is required" })}
                error={errors.endDate?.message}
                required
                disabled={isView}
            />

            {mode !== "create" && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                    { label: "Active", value: "active" },
                                    { label: "Completed", value: "completed" },
                                    { label: "Upcoming", value: "upcoming" },
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