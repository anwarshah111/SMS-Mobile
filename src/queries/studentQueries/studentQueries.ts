import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {showToast} from '../../components/Toasters/CustomToasts';

const BASE_URL = 'http://localhost:3000';

const registerStudentsHandler = async ({data}: any) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/students/register-student`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error.response);
    throw error;
  }
};

export const useRegisterStudentsMutation = config => {
  return useMutation({
    mutationFn: registerStudentsHandler,
    ...config,
  });
};

const sendStudentLoginOTPHandler = async ({data}: any) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/students/send-student-otp`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error.response);
    throw error;
  }
};

export const useStudentRequestLoginOTPMutation = config => {
  return useMutation({
    mutationFn: sendStudentLoginOTPHandler,
    ...config,
  });
};
const verifyStudentLoginOTPHandler = async ({data}: any) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/students/verify-student-otp`,
      data,
    );

    return res.data;
  } catch (error) {
    console.error('Error verify OTP', error.response);
    throw error;
  }
};

export const useStudentRequestOTPVeifyMutation = config => {
  return useMutation({
    mutationFn: verifyStudentLoginOTPHandler,
    ...config,
  });
};

export const fetchLoginStudentDetails = async data => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/students/get-login-student-details`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

export const useFetchLoginStudentDetails = (id, data, enabled) =>
  useQuery({
    queryKey: ['loginStudent', id],
    enabled: enabled,
    queryFn: () => fetchLoginStudentDetails(data),
  });
