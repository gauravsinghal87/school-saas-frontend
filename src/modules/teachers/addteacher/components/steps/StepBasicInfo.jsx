import React from 'react';
import SectionTitle from '../SectionTitle';
import Input from '../../../../../components/common/Input';
import PhoneInput from 'react-phone-input-2';

export default function StepBasicInfo() {
  return (
    <div className="animate-slide-in">
                <SectionTitle icon="👤" title="Personal Information" subtitle="Basic identity and login credentials" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  </div>
<div className='grid grid-cols-2 gap-3'>
    <Input label="Full Name" name="name" placeholder="Enter full name" required={true} />
    <Input label="Email" name="email" type="email" placeholder="Enter email" required={true} />
    <PhoneInput   label="Phone Number"
  name="phone"
  value={form.phone}
  onChange={handleChange}
  error={errors.phone}/>
</div>
        
                  </div>

  )
}
