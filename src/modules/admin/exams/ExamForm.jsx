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
  render={({ field }) => (
    <Select
      isMulti
      label="Class"
      placeholder="Select class"
      options={classoptions}
      value={classoptions.filter(option =>
        field.value?.includes(option.value)
      )}
      onChange={(e) => field.onChange(e.target.value)}
      error={errors.classId?.message}
      disabled={isView}
    />
  )}
/>
            <Input
                label="Exam Date"
                id="exam_date"
                type="date"
                placeholder="Exam Date"
                register={register("examDate", { required: "Exam date is required" })}
                error={errors.examDate?.message}
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