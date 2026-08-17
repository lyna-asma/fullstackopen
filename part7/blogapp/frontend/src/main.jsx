import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

// Browser router , listens to the browser s URL and makes it available for App 
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)