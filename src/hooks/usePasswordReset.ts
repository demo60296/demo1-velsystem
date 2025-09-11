import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { usePasswordReset } from '../contexts/PasswordResetContext';
import apiClient from '../lib/axios';

interface ForgotPasswordData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

// Send OTP to email
export const useForgotPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setEmail } = usePasswordReset();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await apiClient.post(`/auth/password/forgot?email=${encodeURIComponent(data.email)}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      addToast({
        type: 'success',
        title: 'OTP sent',
        message: 'A 6-digit verification code has been sent to your email.',
      });
      navigate('/verify-otp');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to send OTP',
        message: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
};

// Verify OTP
export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setOtpVerified } = usePasswordReset();

  return useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      const response = await apiClient.post(
        `/auth/password/verify-otp?otp=${encodeURIComponent(data.otp)}`
      );
      return response.data;
    },
    onSuccess: () => {
      setOtpVerified(true);
      addToast({
        type: 'success',
        title: 'OTP verified',
        message: 'You can now reset your password.',
      });
      navigate('/reset-password');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Invalid OTP',
        message: error?.response?.data?.message || 'Please check your code and try again.',
      });
    },
  });
};

// Reset password
export const useResetPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { clearState } = usePasswordReset();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await apiClient.post(
        `/auth/password/reset?password=${encodeURIComponent(data.newPassword)}`
      );
      return response.data;
    },
    onSuccess: () => {
      clearState();
      addToast({
        type: 'success',
        title: 'Password reset successful',
        message: 'You can now sign in with your new password.',
      });
      navigate('/signin');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Failed to reset password',
        message: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
};