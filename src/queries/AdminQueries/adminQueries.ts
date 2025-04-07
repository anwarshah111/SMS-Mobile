import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
export const fetchPendingSchools = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/schools/getSchoolList?status=P`,
    );
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
    const res = await axios.put(
      `${BASE_URL}/api/admin/school-request/${id}/status`,
      data,
    );
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
