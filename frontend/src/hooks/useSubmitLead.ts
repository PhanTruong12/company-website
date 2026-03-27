// hooks/useSubmitLead.ts - submit lead via Google Apps Script
import { useCallback, useRef, useState } from 'react';
import type { LeadFormValues, LeadFieldErrors } from '../types/lead';
import { GOOGLE_SCRIPT_URL } from '../constants/api';

const PHONE_MIN_DIGITS = 9;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REQUIRED_MESSAGE = 'Vui lòng nhập họ và tên.';
const PHONE_REQUIRED_MESSAGE = 'Vui lòng nhập số điện thoại.';
const EMAIL_INVALID_MESSAGE = 'Email không đúng định dạng.';
const SUBMIT_ERROR_MESSAGE = 'Gửi thất bại. Vui lòng thử lại sau.';
const DEBOUNCE_WINDOW_MS = 900;

type SubmitResult = { ok: true } | { ok: false; error?: string };

export const useSubmitLead = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});

  // Chống submit nhiều lần bằng thời gian gần nhất
  const lastSubmitAtRef = useRef<number>(0);

  const validate = useCallback((values: LeadFormValues): LeadFieldErrors => {
    const errors: LeadFieldErrors = {};

    const name = values.name.trim();
    const phone = values.phone.trim();
    const email = values.email?.trim() ?? '';

    if (!name) errors.name = NAME_REQUIRED_MESSAGE;
    if (!phone) errors.phone = PHONE_REQUIRED_MESSAGE;

    if (phone) {
      const digits = phone.replace(/\\D/g, '');
      if (digits.length < PHONE_MIN_DIGITS) {
        errors.phone = 'Số điện thoại chưa đúng. Vui lòng kiểm tra lại.';
      }
    }

    if (email) {
      if (!EMAIL_REGEX.test(email)) errors.email = EMAIL_INVALID_MESSAGE;
    }

    return errors;
  }, []);

  const submitLead = useCallback(
    async (values: LeadFormValues): Promise<SubmitResult> => {
      const now = Date.now();
      if (isLoading) return { ok: false };
      if (now - lastSubmitAtRef.current < DEBOUNCE_WINDOW_MS) return { ok: false };

      const errors = validate(values);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setErrorMessage(null);
        setSuccessMessage(null);
        return { ok: false };
      }

      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      lastSubmitAtRef.current = now;

      try {
        const formBody = new URLSearchParams({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() ?? '',
          message: values.message?.trim() ?? '',
        }).toString();

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        });

        if (!response.ok) {
          setErrorMessage(SUBMIT_ERROR_MESSAGE);
          return { ok: false };
        }

        // Apps Script có thể trả JSON hoặc text; cố parse JSON trước
        const contentType = response.headers.get('content-type') || '';
        let resultJson: unknown = null;
        if (contentType.includes('application/json')) {
          resultJson = await response.json();
        } else {
          const text = await response.text();
          try {
            resultJson = JSON.parse(text);
          } catch {
            resultJson = null;
          }
        }

        const obj =
          resultJson && typeof resultJson === 'object'
            ? (resultJson as Record<string, unknown>)
            : null;

        const ok =
          (obj && typeof obj.success === 'boolean' ? obj.success : false) ||
          (obj && typeof obj.result === 'string' ? obj.result.toLowerCase() === 'success' : false);

        if (!ok) {
          setErrorMessage(SUBMIT_ERROR_MESSAGE);
          return { ok: false };
        }

        setFieldErrors({});
        setSuccessMessage('Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
        return { ok: true };
      } catch {
        setErrorMessage(SUBMIT_ERROR_MESSAGE);
        return { ok: false };
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, validate]
  );

  const resetMessages = useCallback(() => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  return {
    isLoading,
    successMessage,
    errorMessage,
    fieldErrors,
    submitLead,
    resetMessages,
  };
};

