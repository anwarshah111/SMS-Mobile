import React, {useEffect, useState} from 'react';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Index from './src/Index';
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  );
};

export default App;
