import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WeddingProvider } from './context/WeddingContext'
import App       from './App'
import AdminPage from './admin/AdminPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WeddingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<App />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </WeddingProvider>
  </React.StrictMode>
)
