import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";

export default function AcademicYearForm({
    register,
    errors,
    mode = "create",
    control
}) {
    const isView = mode === "view";

    return (
        <div className="flex flex-col gap-4">

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



            {/* Status */}
            {
                mode !== "create" && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold">Status</label>

                        {/* <select
          {...register("status")}
          disabled={isView}
          className="border border-border rounded-lg px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select> */}
                        {

                        }
                        <Controller
                            name="status"
                            control={control}
                            // defaultValue="active"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
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
                )
            }

        </div>
    );
}