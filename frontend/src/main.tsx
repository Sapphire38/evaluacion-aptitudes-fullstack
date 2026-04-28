import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutesWrapper from './app/router/routes.tsx'
import { Provider } from 'react-redux'
import store from './app/store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" closeButton />
        <RoutesWrapper />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
