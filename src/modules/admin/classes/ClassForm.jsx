import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";
import { academicYearList } from "../../../hooks/useQueryMutations";

export default function ClassForm({
  register,
  errors,
  mode = "create",
  control
}) {
  const isView = mode === "view";
const { data: academicSessions } = academicYearList({ page: 1, limit: 100, search: "" });
const academicSessionOptions = academicSessions?.results?.map((session) => ({
  label: session.academicSession,
  value: session._id,
})) || [];
console.log("academicsessions",academicSessionOptions);
  return (
    <div className="flex flex-col gap-4">

      <Input
        label="Class Name"
        id="name"
        type="number"
        placeholder="1"
        register={register("name", { required: "Class name is required" })}
error={errors.name?.message}
        required
        disabled={isView}
      />






      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">Academic Session</label>

        {/* <select
          {...register("status")}
          disabled={isView}
          className="border border-border rounded-lg px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select> */}
<Controller
  name="academicSessionId"
  control={control}
  render={({ field }) => (
    <Select
      value={field.value || ""}
      onChange={(val) => field.onChange(val)}
      options={academicSessionOptions}
      placeholder="Select academic session"
      error={errors.academicSessionId?.message}
      disabled={isView}
    />
  )}
/>
      </div>

    </div>
  );
}