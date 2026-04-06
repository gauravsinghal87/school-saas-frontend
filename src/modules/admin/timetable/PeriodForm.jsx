import { Controller } from "react-hook-form";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { academicYearList } from "../../../hooks/useQueryMutations";

export default function PeriodForm({
    register,
    errors,
    mode = "create",
    control,
    selectedAcademicYear
}) {
    const isView = mode === "view";

    // Fetch academic sessions
    const { data: academicSessions } = academicYearList({ page: 1, limit: 100, search: "" });
    const academicSessionOptions = academicSessions?.results?.map((session) => ({
        label: session.academicSession || `${new Date(session.startDate).getFullYear()}-${new Date(session.endDate).getFullYear()}`,
        value: session._id,
    })) || [];

    return (
        <div className="flex flex-col gap-4">
            {/* Academic Session */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                    Academic Session <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="academicSessionId"
                    control={control}
                    rules={{ required: "Academic session is required" }}
                    render={({ field }) => (
                        <Select
                            value={field.value || selectedAcademicYear || ""}
                            onChange={(val) => field.onChange(val)}
                            options={academicSessionOptions}
                            placeholder="Select academic session"
                            error={errors.academicSessionId?.message}
                            disabled={isView}
                        />
                    )}
                />
            </div>

            {/* Period Name */}
            <Input
                label="Period Name"
                id="name"
                placeholder="e.g., Period 1, Lunch, Break"
                register={register("name", { required: "Period name is required" })}
                error={errors.name?.message}
                required
                disabled={isView}
            />

            {/* Order */}
            <Input
                label="Order"
                id="order"
                type="number"
                placeholder="1, 2, 3..."
                register={register("order", {
                    required: "Order is required",
                    min: { value: 1, message: "Order must be at least 1" }
                })}
                error={errors.order?.message}
                required
                disabled={isView}
            />

            {/* Start Time */}
            <Input
                label="Start Time"
                id="startTime"
                type="time"
                placeholder="09:00"
                register={register("startTime", { required: "Start time is required" })}
                error={errors.startTime?.message}
                required
                disabled={isView}
            />

            {/* End Time */}
            <Input
                label="End Time"
                id="endTime"
                type="time"
                placeholder="10:00"
                register={register("endTime", {
                    required: "End time is required",
                    validate: (value, formValues) => {
                        if (formValues.startTime && value <= formValues.startTime) {
                            return "End time must be after start time";
                        }
                        return true;
                    }
                })}
                error={errors.endTime?.message}
                required
                disabled={isView}
            />
        </div>
    );
}