import React from "react";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";

export default function PayrollForm({
  register,
  errors,
  isView = false,
  control,
}) {

  // ✅ Month options
  const monthOptions = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // ✅ Year options (current + 4 previous)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return { label: year.toString(), value: year.toString() };
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Month */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">Month</label>

        <Controller
          name="month"
          control={control}
          rules={{ required: "Month is required" }}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
              options={monthOptions}
              placeholder="Select month"
              error={errors?.month?.message}
              disabled={isView}
            />
          )}
        />
      </div>

      {/* Year */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">Year</label>

        <Controller
          name="year"
          control={control}
          rules={{ required: "Year is required" }}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
              options={yearOptions}
              placeholder="Select year"
              error={errors?.year?.message}
              disabled={isView}
            />
          )}
        />
      </div>

    </div>
  );
}