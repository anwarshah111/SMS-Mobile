import {
  useMutation,
  useQuery,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';

import api from '../../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSchoolStore from '../../zustand/schoolStore';

export const fetchPendingStudents = async id => {
  try {
    const res = await api.get(`/api/schools/getPendingStudents?schoolID=${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

const useFetchStudents = id =>
  useQuery({
    queryKey: ['pendingStudents'],
    queryFn: () => fetchPendingStudents(id),
  });

const updateStudentStatus = async ({studentID, status}: any) => {
  try {
    const res = await api.put(`/api/schools/updateStudentRequestStatus`, {
      studentID: studentID,
      status: status,
    });
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error);
    throw error;
  }
};

export const useUpdateStudentRequestMutate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentStatus,
    onMutate: async ({studentID, status}) => {
      await queryClient.cancelQueries({queryKey: ['pendingStudents']});

      // Get previous data
      const previousStudents = queryClient.getQueryData(['pendingStudents']);

      // Optimistically update UI by removing the accepted student
      queryClient.setQueryData(['pendingStudents'], (oldData: any) =>
        oldData
          ? oldData.filter((student: any) => student._id !== studentID)
          : [],
      );

      return {previousStudents};
    },
    onError: (_error, studentId, context) => {
      // Rollback if the mutation fails
      if (context?.previousStudents) {
        queryClient.setQueryData(['pendingStudents'], context.previousStudents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['pendingStudents']});
    },
  });
};

export const fetchApprovedStudents = async id => {
  try {
    const res = await api.get(
      `/api/schools/getApprovedStudents?&schoolId=${id}`,
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

export const useFetchApprovedStudents = id =>
  useQuery({
    queryKey: ['approvedStudents'],
    queryFn: () => fetchApprovedStudents(id),
  });

const removeStudentFromSchool = async ({id}: any) => {
  try {
    const res = await api.delete(`/api/schools/removeStudentFromSchool/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error.response);
    throw error;
  }
};

export const useRemoveStudentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeStudentFromSchool,
    onMutate: async ({studentID}) => {
      await queryClient.cancelQueries({queryKey: ['approvedStudents']});
      const previousStudents = queryClient.getQueryData(['approvedStudents']);

      queryClient.setQueryData(['approvedStudents'], (oldData: any) =>
        oldData
          ? oldData.filter((student: any) => student._id !== studentID)
          : [],
      );

      return {previousStudents};
    },
    onError: (_error, studentId, context) => {
      // Rollback if the mutation fails
      if (context?.previousStudents) {
        queryClient.setQueryData(
          ['approvedStudents'],
          context.previousStudents,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['approvedStudents']});
    },
  });
};

const registerSchoolHandler = async ({data}: any) => {
  try {
    const res = await api.post(`/api/schools/register`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error.response);
    throw error;
  }
};

export const useRegisterSchoolssMutation = config => {
  return useMutation({
    mutationFn: registerSchoolHandler,
    ...config,
  });
};

const loginSchoolUsingEmailAndPassword = async ({data}: any) => {
  try {
    const res = await api.post(`/api/schools/login`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error.response);
    throw error;
  }
};

export const useLoginSchoolMutation = config => {
  return useMutation({
    mutationFn: loginSchoolUsingEmailAndPassword,
    ...config,
  });
};

export const fetchSchoolDetailsById = async (data: any) => {
  let schoolToken, schoolID;
  if (!data) {
    schoolToken = await AsyncStorage.getItem('@SCHOOOL_TOKEN');
    schoolID = await AsyncStorage.getItem('@SCHOOL_ID');
  }

  if (data || schoolID) {
    try {
      console.log('SCHOOL DATA');
      const res = await api.post(
        `/api/schools/get-school-details-by-id`,
        data
          ? data
          : { 
              id: schoolID,
            },
      );
      useSchoolStore.setState({
        schoolDetails: res.data.school,
        schoolToken: res.data.school?.token,
        schoolId: res.data?.school?._id,
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching:', error);
    }
  } else {
    return null;
  }
};

export const useFetchSchoolDetailsByIdQuery = (data, enabled) =>
  useQuery({
    queryKey: ['schoolDetails'],
    enabled: enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => fetchSchoolDetailsById(data),
  });

export default useFetchStudents;
