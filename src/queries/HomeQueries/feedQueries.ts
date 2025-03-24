import {useInfiniteQuery} from '@tanstack/react-query';
import axios from 'axios';

export const fetchFeedVideos = async ({pageParam = 1}) => {
  try {
    const res = await axios.get(
      `https://api.pexels.com/videos/popular?page=${pageParam}`,
      {
        headers: {
          Authorization: process.env.VIDEO_API_KEY,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

const useFetchVideos = () =>
  useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: fetchFeedVideos,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.next_page ? lastPage.page + 1 : undefined;
    },
    select: data => ({
      videos: data.pages.flatMap(page => page.videos),
    }),
  });

export default useFetchVideos;
