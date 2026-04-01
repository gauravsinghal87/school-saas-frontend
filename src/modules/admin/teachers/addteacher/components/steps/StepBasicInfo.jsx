import React from 'react';
import SectionTitle from '../SectionTitle';
import Input from '../../../../../../components/common/Input';
import AppPhoneInput from '../../../../../../components/common/PhoneInput';
export default function StepBasicInfo({ formData, handleChange }) {
  return (
    <div className="animate-slide-in">
      <SectionTitle
        icon="👤"
        title="Personal Information"
        subtitle="Basic identity and login credentials"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <AppPhoneInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}

        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
        />
      </div>
    </div>
  );
}
