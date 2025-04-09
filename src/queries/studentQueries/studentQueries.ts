import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {showToast} from '../../components/Toasters/CustomToasts';
import useStudentStore from '../../zustand/studentStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const fetchLoginStudentDetails = async (data: any) => {
  let studentMobileNumber, studentCountryCode;

  if (!data) {
    studentMobileNumber = await AsyncStorage.getItem('@STUDENT_MOBILE_NUMBER');
    studentCountryCode = await AsyncStorage.getItem('@STUDENT_COUNTRY_CODE');
  }
  if (data || (studentMobileNumber && studentCountryCode)) {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/students/get-login-student-details`,
        data
          ? data
          : {
              mobileNumber: studentMobileNumber,
              countryCode: studentCountryCode,
            },
      );
      useStudentStore.setState({
        studentDetails: res.data.student,
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
