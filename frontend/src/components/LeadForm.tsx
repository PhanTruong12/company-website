import { useState } from 'react';
import type { LeadFormValues } from '../types/lead';
import { useSubmitLead } from '../hooks/useSubmitLead';

type LeadFormProps = {
  className?: string;
};

const emptyValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

const LeadForm = ({ className }: LeadFormProps) => {
  const [values, setValues] = useState<LeadFormValues>(emptyValues);

  const { isLoading, successMessage, errorMessage, fieldErrors, submitLead, resetMessages } =
    useSubmitLead();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const result = await submitLead(values);
    if (result.ok) {
      setValues(emptyValues);
    }
  };

  return (
    <form className={`contact-form ${className ?? ''}`.trim()} onSubmit={handleSubmit}>
      {successMessage && <div className="form-success">{successMessage}</div>}
      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Họ và tên <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            className="form-input"
            required
            placeholder="Nhập họ và tên của bạn"
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <div className="form-field-error">{fieldErrors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={onChange}
            className="form-input"
            required
            placeholder="093 578 93 63"
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <div className="form-field-error">{fieldErrors.phone}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email ?? ''}
          onChange={onChange}
          className="form-input"
          placeholder="your.email@example.com"
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && <div className="form-field-error">{fieldErrors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Nội dung tin nhắn
        </label>
        <textarea
          id="message"
          name="message"
          value={values.message ?? ''}
          onChange={onChange}
          className="form-textarea"
          rows={5}
          placeholder="Mô tả nhu cầu của bạn hoặc đặt câu hỏi..."
        />
      </div>

      <button type="submit" className="form-submit" disabled={isLoading}>
        {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
      </button>
    </form>
  );
};

export default LeadForm;

