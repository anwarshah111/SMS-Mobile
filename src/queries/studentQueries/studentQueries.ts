import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {showToast} from '../../components/Toasters/CustomToasts';
import useStudentStore from '../../zustand/studentStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios/axios';

const registerStudentsHandler = async ({data}: any) => {
  try {
    const res = await api.post(`/api/students/register-student`, data);
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
    const res = await api.post(`/api/students/send-student-otp`, data);
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
    const res = await api.post(`/api/students/verify-student-otp`, data);

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

export const fetchLoginStudentDetails = async (data: any) => {
  let studentMobileNumber, studentCountryCode, studentToken;

  if (!data) {
    studentMobileNumber = await AsyncStorage.getItem('@STUDENT_MOBILE_NUMBER');
    studentCountryCode = await AsyncStorage.getItem('@STUDENT_COUNTRY_CODE');
    studentToken = await AsyncStorage.getItem('@STUDENT_TOKEN');
  }
  if (data || (studentMobileNumber && studentCountryCode && studentToken)) {
    try {
      const res = await api.post(
        `/api/students/get-login-student-details`,
        data
          ? data
          : {
              mobileNumber: studentMobileNumber,
              countryCode: studentCountryCode,
            },
      );
      useStudentStore.setState({
        studentDetails: res.data.student,
        studentToken: res.data.student?.token,
        studentId: res.data?.student?._id,
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }
};

export const useFetchLoginStudentDetails = (data, enabled) =>
  useQuery({
    queryKey: ['loginStudent'],
    enabled: enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: () => fetchLoginStudentDetails(data),
  });
