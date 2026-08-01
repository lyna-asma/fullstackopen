import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

// this holds the cache of all server data fetched by TanStack Query, shared app-wide
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  // wraps the whole app so any component inside can use useQuery/useMutation
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)