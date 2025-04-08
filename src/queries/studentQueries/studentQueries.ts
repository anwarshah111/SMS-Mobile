import {useMutation, useQueryClient} from '@tanstack/react-query';
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
