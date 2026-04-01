import Input from "../../../../components/common/Input";

export default function SubscriptionForm({
  register,
  errors,
  mode = "create",
}) {
  const isView = mode === "view";

  return (
    <div className="flex flex-col gap-4">

      <Input
        label="Plan Name"
        id="name"
        placeholder="Netflix Premium"
        register={register("name", { required: "Name is required" })}
        error={errors.name}
        required
        disabled={isView}
      />

      <Input
        label="Price"
        id="price"
        type="number"
        placeholder="499"
        register={register("price", { required: "Price is required" })}
        error={errors.price}
        required
        disabled={isView}
      />

      <Input
        label="Duration (Days)"
        id="duration_days"
        type="number"
        placeholder="30"
        register={register("duration_days", { required: "Duration is required" })}
        error={errors.duration_days}
        required
        disabled={isView}
      />

      <Input
        label="Features"
        id="features"
        placeholder="HD Streaming, No Ads"
        register={register("features", { required: "Features required" })}
        error={errors.features}
        required
        disabled={isView}
      />

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">Status</label>

        <select
          {...register("status")}
          disabled={isView}
          className="border border-border rounded-lg px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

    </div>
  );
}