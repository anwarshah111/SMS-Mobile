import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = `https://api.restful-api.dev/objects`;

export const getTestData = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

const useTestQueries = () =>
  useQuery({
    queryKey: ['test-data'],
    queryFn: getTestData,
  });

const getTestDetailsByID = async id => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

export const useTestDetailsQuery = id =>
  useQuery({
    queryKey: ['test-datails', id],
    queryFn: () => getTestDetailsByID(id),
  });

export default useTestQueries;
