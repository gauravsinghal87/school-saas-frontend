import React, { useState } from "react";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import FormGroup from "../../components/common/Formgroup";
import DateRangePicker from "./DateRangePicker";

export default function ComponentsDemo() {
const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "",
  subjects: [], // ✅ multi select
  message: ""
});
  const [range, setRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = () => {
  let newErrors = {};

  if (!form.name) newErrors.name = "Name is required";
  if (!form.email) newErrors.email = "Email is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {

    const payload = {
      ...form,
      dateRange: {
        startDate: range.startDate,
        endDate: range.endDate
      }
    };


    // 🔥 API CALL
    // api.post("/create-user", payload)
  }
};

  return (
    <div className="min-h-screen bg-[var(--color-surface-page)] p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
          Common Components Demo
        </h1>

        {/* CARD WRAPPER */}
        <Card>
          <div className="space-y-5">

            {/* INPUT */}
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              error={errors.name}
            />

            {/* EMAIL */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              error={errors.email}
            />
               <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={errors.password}
            />

            {/* SELECT */}
           <Select
  label="Role"
  name="role"
  value={form.role}
  onChange={handleChange}
  options={[
    { label: "Admin", value: "admin" },
    { label: "Teacher", value: "teacher" }
  ]}
/>
<Select
  label="Subjects"
  name="subjects"
  isMulti
  value={form.subjects}
  onChange={handleChange}
  options={[
    { label: "Math", value: "math" },
    { label: "Science", value: "science" },
    { label: "English", value: "english" }
  ]}
/>

            {/* TEXTAREA */}
            <Textarea
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write something..."
            />
 <div className="p-10">
      <DateRangePicker value={range} onChange={setRange} />
    </div>
            {/* FORM GROUP (CUSTOM USAGE) */}
            <FormGroup label="Custom Field" required>
              <input
                className="w-full h-[44px] px-4 rounded-xl border border-[var(--color-border)]"
                placeholder="Custom input inside FormGroup"
              />
            </FormGroup>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <Button onClick={handleSubmit}>
                Submit
              </Button>

              <Button variant="outline">
                Cancel
              </Button>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}