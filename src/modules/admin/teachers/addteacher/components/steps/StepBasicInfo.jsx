import React from 'react';
import SectionTitle from '../SectionTitle';
import Input from '../../../../../../components/common/Input';
import AppPhoneInput from '../../../../../../components/common/PhoneInput';
import { Controller } from 'react-hook-form';
import Select from "../../../../../../components/common/Select";

export default function StepBasicInfo({
  register,
  errors,
  control,
  watch
}) {
  function passwordStrength(pw) {
    if (!pw) return { score: 0, label: "", color: "", bg: "", width: "0%" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
      { label: "", color: "bg-slate-200", bg: "text-slate-400", width: "0%" },
      { label: "Weak", color: "bg-rose-400", bg: "text-rose-500", width: "25%" },
      { label: "Fair", color: "bg-amber-400", bg: "text-amber-600", width: "50%" },
      { label: "Good", color: "bg-blue-400", bg: "text-blue-600", width: "75%" },
      { label: "Strong", color: "bg-emerald-400", bg: "text-emerald-600", width: "100%" },
    ];
    return { score: s, ...map[s] };
  }
  const pwValue = watch("password");
  const strength = passwordStrength(pwValue);

  return (
    <div className="animate-slide-in">
      <SectionTitle
        icon="👤"
        title="Personal Information"
        subtitle="Basic identity and login credentials"
      />

      <div className="grid grid-cols-2 gap-3 space-y-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter full name"
          required
          register={register("name", { required: "Full name is required" })}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          register={register("email", { required: "Email is required" })}
          error={errors.email?.message}
          placeholder="Enter email"
          required
        />
        {/* 
        <AppPhoneInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}

        /> */}


        <Controller
          name="phone"
          control={control}
            defaultValue=""
  rules={{
    required: "Phone Number is required",   // ✅ validation here
  }}
          render={({ field }) => (
            <AppPhoneInput
              label="Phone Number"
              onChange={(val) => field.onChange(val)}
              value={field.value}
            // onChange={handleChange}
            error={errors.phone?.message}

            />
            // <Select
            //   value={field.value}
            //   onChange={(val) => field.onChange(val)}
            //   options={[
            //     { label: "Active", value: "active" },
            //     { label: "Inactive", value: "inactive" },
            //   ]}
            //   placeholder="Select status"
            //   error={errors.status?.message}
            //   disabled={isView}
            // />
          )}
        />
        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            register={register("password", { required: "Password is required" })}
            error={errors.password?.message}
            placeholder="Enter password"
            required
          />
          {pwValue && (
            <div className="mt-2">
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full strength-fill ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className={`text-[11px] font-600 mt-1 ${strength.bg}`}>{strength.label} password</p>
            </div>
          )}
        </div>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
          placeholder="Confirm password"
          required
        />
        <Input
          label="Date Of Birth"
          name="dateOfBirth"
          type="date"
          register={register("dateOfBirth", { required: "Date of birth is required" })}
          error={errors.dateOfBirth?.message}
          placeholder="Select date of birth"
          required
        />
<Controller
  name="gender"
  control={control}
  defaultValue=""
  rules={{
    required: "Gender is required",   // ✅ validation here
  }}
  render={({ field }) => (
    <Select
      label="Select Gender"
      value={field.value}
      onChange={(val) => field.onChange(val)}
      options={[
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ]}
      placeholder="Select gender"
      error={errors.gender?.message}
      menuPortalTarget={document.body}
      isSearchable
    />
  )}
/>
        <Controller
          name="maritalStatus"
          control={control}
          defaultValue=""
          rules={{
            required: "Marital status is required",   // ✅ validation here
          }}
          render={({ field }) => (

            <Select
              label="Select Marital Status"
              value={field.value}
              onChange={(val) => field.onChange(val)}
              options={[
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Divorced", value: "divorced" },
                { label: "Widowed", value: "widowed" },
              ]}
              placeholder="Select marital status"
              error={errors.maritalStatus?.message}
              menuPortalTarget={document.body}
              isSearchable

            />

          )}
        />
      </div>
    </div>
  );
}
