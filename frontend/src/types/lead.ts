// types/lead.ts - Lead form types

export type LeadFormValues = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
};

export type LeadFieldErrors = Partial<Record<keyof LeadFormValues, string>>;

