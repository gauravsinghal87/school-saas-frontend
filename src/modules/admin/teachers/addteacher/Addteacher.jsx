import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import StepBasicInfo from './components/steps/StepBasicInfo';
import SectionTitle from './components/SectionTitle';

const STEPS = [
  { id: "personal", label: "Personal", short: "01", icon: "👤" },
  { id: "professional", label: "Professional", short: "02", icon: "💼" },
  { id: "address", label: "Address", short: "03", icon: "📍" },
  { id: "salary", label: "Salary", short: "04", icon: "💰" },
  { id: "documents", label: "Documents", short: "05", icon: "📄" },
  { id: "review", label: "Review", short: "06", icon: "✓" },
];
export default function Addteacher() {

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
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
  });
console.log("formdata",formData);

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
              <div className="md:max-w-4xl w-[100vw] mx-auto md:px-4 px-2 sm:px-6 py-10 pb-20">
        <div onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-gray-100 cursor-pointer text-gray-600 text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-gray-100 mb-5">
          <span>🔙</span> Back
        </div>
         <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-100 mb-5">
            <span>🏫</span> School Management
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-600 text-slate-900 leading-tight">
            Register a{" "}
            <span className="italic text-indigo-500">New Teacher</span>
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
        <div className="h-1.5 bg-slate-100 rounded-full mb-7 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <StepIndicator step={step} setStep={setStep} />
        <form >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[80px] pointer-events-none" />
{step === 0 && <StepBasicInfo formData={formData} setFormData={setFormData} handleChange={handleChange} />}
</div>
        </form>
        </div>
        </div>
  )
}
