import {View, Text} from 'react-native';
import React from 'react';
import StackNavigation from './src/navigations/StackNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/navigations/MainNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {fetchFeedVideos} from './src/queries/HomeQueries/feedQueries';

const queryClient = new QueryClient();
const App = () => {
  // const insets = useSafeAreaInsets();
  queryClient.prefetchInfiniteQuery({
    queryKey: ['videos'],
    queryFn: () => fetchFeedVideos({pageParam: 1}),
    initialPageParam: 1,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MainNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
