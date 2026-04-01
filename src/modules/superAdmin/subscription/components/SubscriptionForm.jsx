import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import { Controller } from "react-hook-form";

export default function SubscriptionForm({
  register,
  errors,
  mode = "create",
  control
}) {
  const isView = mode === "view";

  return (
    <div className="flex flex-col gap-4">

      <Input
        label="Plan Name"
        id="name"
        placeholder="School Premium Dashboard"
        register={register("name", { required: "Name is required" })}
error={errors.name?.message}
        required
        disabled={isView}
      />

      <Input
        label="Price"
        id="price"
        type="number"
        placeholder="499"
        register={register("price", { required: "Price is required" })}
      error={errors.price?.message}
        required
        disabled={isView}
      />

      <Input
        label="Duration (Days)"
        id="duration_days"
        type="number"
        placeholder="30"
        register={register("duration_days", { required: "Duration is required" })}
        error={errors.duration_days?.message}
        required
        disabled={isView}
      />

      <Input
        label="Features"
        id="features"
        placeholder="HD Streaming, No Ads"
        register={register("features", { required: "Features required" })}
        error={errors.features?.message}
        required
        disabled={isView}
      />

      {/* Status */}
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
<Controller
  name="status"
  control={control}
  defaultValue="active"
  render={({ field }) => (
    <Select
      value={field.value}
      onChange={(val) => field.onChange(val)}
      options={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ]}
      placeholder="Select status"
      error={errors.status?.message}
      disabled={isView}
    />
  )}
/>
      </div>

    </div>
  );
}