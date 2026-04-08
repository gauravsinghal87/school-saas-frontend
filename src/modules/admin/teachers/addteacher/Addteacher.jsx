import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import StepBasicInfo from './components/steps/StepBasicInfo';
import SectionTitle from './components/SectionTitle';
import { set, useForm } from "react-hook-form";


const STEPS = [
  { id: "personal", label: "Personal", short: "01", icon: "👤" },
  { id: "professional", label: "Professional", short: "02", icon: "💼" },
  { id: "address", label: "Address", short: "03", icon: "📍" },
  { id: "salary", label: "Salary", short: "04", icon: "💰" },
  { id: "documents", label: "Documents", short: "05", icon: "📄" },
  { id: "review", label: "Review", short: "06", icon: "✓" },
];
const stepFields = {
  0: [
    "name",
    "email",
    "password",
    "confirmPassword",
    "phone",
    "dateOfBirth",
    "gender",
    "maritalStatus",
  ],
  1: ["designation", "dateOfJoining", "specialization", "qualifications"],
  2: ["address.street", "address.city", "address.state", "address.zip", "address.country"],
  3: ["salaryInfo.basic"],
  4: [],
};
export default function Addteacher() {

  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const { register, handleSubmit, watch, control, trigger, reset, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      dateOfBirth: "",
      confirmPassword: "",
      qualification: "",
      experience: "",
      subjects: [],
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
      },
      salary: {
        amount: "",
        currency: "USD",
        payCycle: "monthly",
      },
      documents: [],
    },
  });

  const goNext = async () => {
    const ok = await trigger(stepFields[step] || []);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (formData) => {
    try {
    } catch (error) {

    }
  }
  return (
    <div className="min-h-screen bg-[--color-surface-page to-indigo-50/40">
      <div className="md:max-w-4xl w-[100vw] ] mx-auto md:px-4 px-2 sm:px-6 py-10 pb-20">
        <div onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-gray-100 cursor-pointer text-gray-600 text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-gray-100 mb-5">
          <span>🔙</span> Back
        </div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-primary text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-100 mb-5">
            <span>🏫</span> School Management
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-600 text-slate-900 leading-tight">
            Register a{" "}
            <span className="italic text-primary">New Teacher</span>
          </h1>
          <p className="mt-3 text-slate-500 text-sm font-400 max-w-md mx-auto leading-relaxed">
            Complete all 6 sections to create a verified teacher account in the system.
          </p>
        </div>
        {/* ── Progress Bar (thin) ── */}
        <div className="mb-2 flex justify-between text-[10px] font-600 uppercase tracking-widest text-slate-400 px-1">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].label}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full mb-7 ">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <StepIndicator step={step} setStep={setStep} />
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-7 sm:p-10 relative ">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[80px] pointer-events-none" />
            {step === 0 && <StepBasicInfo register={register} errors={errors} control={control} watch={watch} />}
            {step === 1 && <div>Professional</div>}
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-600 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Previous
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-600 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200 active:scale-95"
              >
                Continue
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-600 rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                    Submitting…
                  </>
                ) : (
                  <> ✓ Submit Registration </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
