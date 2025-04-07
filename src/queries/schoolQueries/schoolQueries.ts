import {
  useMutation,
  useQuery,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
export const fetchPendingStudents = async id => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/schools/getPendingStudents?schoolID=${id}`,
    );
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
    const res = await axios.put(
      `${BASE_URL}/api/schools/updateStudentRequestStatus`,
      {studentID: studentID, status: status},
    );
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
    const res = await axios.get(
      `${BASE_URL}/api/schools/getApprovedStudents?&schoolId=${id}`,
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
    const res = await axios.delete(
      `${BASE_URL}/api/schools/removeStudentFromSchool/${id}`,
    );
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
export default useFetchStudents;
