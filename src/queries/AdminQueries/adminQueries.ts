import {useMutation, useQuery} from '@tanstack/react-query';

import api from '../../axios/axios';

export const fetchPendingSchools = async () => {
  try {
    const res = await api.get(`/api/schools/getSchoolList?status=P`);
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

const useFetchSchools = () =>
  useQuery({
    queryKey: ['pendingSchools'],
    queryFn: fetchPendingSchools,
  });

const updateSchoolStatus = async ({id, data}: any) => {
  try {
    const res = await api.put(`/api/admin/school-request/${id}/status`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating school details:', error);
    throw error;
  }
};

export const useUpdateSchoolStatus = () =>
  useMutation({
    mutationFn: updateSchoolStatus,
  });

export default useFetchSchools;
