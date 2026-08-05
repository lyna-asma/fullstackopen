import  ReactDOM   from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

// this holds the cache of all server data fetched by TanStack Query, shared app-wide
const queryClient = new QueryClient()

// main.jsx — wrap App so everything inside can reach the box

import { NotificationProvider } from './contexts/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </QueryClientProvider>
)